import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast({ 
        title: "خطأ", 
        description: "كلمات المرور غير متطابقة", 
        variant: "destructive" 
      });
    }

    const result = await register(name, email, password);
    if (result.success) {
      toast({ title: "تم إنشاء الحساب بنجاح!", description: "يمكنكِ الآن تسجيل الدخول." });
      navigate('/login');
    } else {
      toast({ title: "خطأ", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <Header />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-amber-100">
          <h2 className="text-3xl font-bold text-amber-900 text-center mb-8 font-['Tajawal']">إنشاء حساب جديد</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-amber-900 mb-1 font-medium">الاسم بالكامل</label>
              <Input 
                type="text" 
                placeholder="أدخلي اسمكِ" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="text-amber-950 bg-white border-amber-200 h-12 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-amber-900 mb-1 font-medium">البريد الإلكتروني</label>
              <Input 
                type="email" 
                placeholder="example@mail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="text-amber-950 bg-white border-amber-200 h-12 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-amber-900 mb-1 font-medium">كلمة المرور</label>
              <Input 
                type="password" 
                placeholder="********" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="text-amber-950 bg-white border-amber-200 h-12 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-amber-900 mb-1 font-medium">تأكيد كلمة المرور</label>
              <Input 
                type="password" 
                placeholder="********" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="text-amber-950 bg-white border-amber-200 h-12 placeholder:text-gray-400"
              />
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg mt-6">
              إنشاء الحساب
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            لديكِ حساب بالفعل؟ <Link to="/login" className="text-amber-700 font-bold underline hover:text-amber-800">سجلي دخولكِ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;