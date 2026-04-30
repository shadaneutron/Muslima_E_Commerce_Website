import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '../components/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // لو المستخدم مسجل دخول بالفعل، يتم تحويله للرئيسية فوراً
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast({ title: "أهلاً بكِ مجدداً في مسلمة" });
      navigate('/');
    } else {
      toast({ 
        title: "خطأ في الدخول", 
        description: result.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <Header />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-amber-100">
          <h2 className="text-3xl font-bold text-amber-900 text-center mb-8 font-['Tajawal']">تسجيل الدخول</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-amber-900 mb-2 font-medium">البريد الإلكتروني</label>
              <Input 
                type="email" 
                placeholder="example@mail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="text-amber-950 bg-white border-amber-200 focus:border-amber-500 h-12 text-lg placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-amber-900 mb-2 font-medium">كلمة المرور</label>
              <Input 
                type="password" 
                placeholder="********" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="text-amber-950 bg-white border-amber-200 focus:border-amber-500 h-12 text-lg placeholder:text-gray-400"
              />
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg mt-4 shadow-md transition-all">
              دخول
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            ليس لديكِ حساب؟ <Link to="/register" className="text-amber-700 font-bold underline hover:text-amber-800">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;