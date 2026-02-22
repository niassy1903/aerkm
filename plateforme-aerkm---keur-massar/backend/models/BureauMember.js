
import mongoose from 'mongoose';

const bureauMemberSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  mandat: { 
    type: String, 
    default: '2024-2025' 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  bio: {
    type: String,
    default: ''
  }
}, { timestamps: true });

bureauMemberSchema.index({ isActive: 1, order: 1 });

const BureauMember = mongoose.model('BureauMember', bureauMemberSchema);
export default BureauMember;
