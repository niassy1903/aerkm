
import express from 'express';
import BureauMember from '../models/BureauMember.js';
import User from '../models/User.js';
import Log from '../models/Log.js';

const router = express.Router();

// GET /api/bureau - Public list
router.get('/', async (req, res) => {
  try {
    const members = await BureauMember.find({ isActive: true })
      .populate({
        path: 'studentId',
        select: 'prenom nom email telephone imageUrl',
      })
      .sort({ order: 1 })
      .lean();
    
    // Flatten the response for easier frontend usage
    const flattened = members.map(m => ({
      _id: m._id,
      position: m.position,
      mandat: m.mandat,
      isActive: m.isActive,
      order: m.order,
      bio: m.bio,
      ...m.studentId
    }));

    res.json(flattened);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du bureau." });
  }
});

// GET /api/bureau/admin - Admin list with search/pagination
router.get('/admin', async (req, res) => {
  try {
    const { search, position, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (position && position !== 'Tous') {
      query.position = position;
    }

    let members = await BureauMember.find(query)
      .populate({
        path: 'studentId',
        select: 'prenom nom email telephone',
      })
      .sort({ order: 1 })
      .lean();

    if (search) {
      const s = search.toLowerCase();
      members = members.filter(m => 
        m.studentId.prenom.toLowerCase().includes(s) || 
        m.studentId.nom.toLowerCase().includes(s) ||
        m.studentId.email.toLowerCase().includes(s) ||
        m.position.toLowerCase().includes(s)
      );
    }

    const total = members.length;
    const paginated = members.slice((page - 1) * limit, page * limit);

    res.json({
      members: paginated.map(m => ({
        _id: m._id,
        position: m.position,
        mandat: m.mandat,
        isActive: m.isActive,
        order: m.order,
        ...m.studentId
      })),
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// POST /api/bureau - Add a member
router.post('/', async (req, res) => {
  try {
    const { studentId, position, mandat, order, bio } = req.body;

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Étudiant non trouvé." });

    // Check if already in bureau
    const existing = await BureauMember.findOne({ studentId });
    if (existing) return res.status(400).json({ message: "Cet étudiant est déjà membre du bureau." });

    const newMember = new BureauMember({
      studentId,
      position,
      mandat,
      order: order || 0,
      bio: bio || ''
    });

    await newMember.save();

    await new Log({
      action: 'BUREAU_ADD',
      details: `Ajout de ${student.prenom} ${student.nom} au bureau (${position})`,
      adminId: 'ADMIN'
    }).save();

    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bureau/:id - Update member
router.put('/:id', async (req, res) => {
  try {
    const updated = await BureauMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/bureau/:id - Remove member
router.delete('/:id', async (req, res) => {
  try {
    const member = await BureauMember.findById(req.params.id).populate('studentId');
    await BureauMember.findByIdAndDelete(req.params.id);

    if (member) {
      await new Log({
        action: 'BUREAU_DELETE',
        details: `Retrait de ${member.studentId.prenom} ${member.studentId.nom} du bureau`,
        adminId: 'ADMIN'
      }).save();
    }

    res.json({ message: "Membre retiré du bureau." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
