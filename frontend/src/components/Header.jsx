import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, User, Globe, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = ({ onCartClick, onMenuClick }) => {
  const { language, setLanguage } = useLanguage();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-amber-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        <Link to="/" className="text-3xl font-bold text-amber-900 font-['Tajawal']">
          {language === 'ar' ? 'مسلمة' : 'MUSLIMA'}
        </Link>

        <div className="flex items-center gap-2 md:gap-5">
          <Button variant="ghost" size="icon" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="text-amber-800">
            <Globe className="h-5 w-5" />
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:block font-bold text-amber-950">
                {/* هنا سيظهر الاسم الحقيقي بدلاً من undefined */}
                أهلاً، {user.first_name || user.username}
              </span>
              <Button variant="ghost" size="icon" onClick={logout} className="text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-amber-800">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          <Button onClick={onCartClick} variant="ghost" size="icon" className="relative text-amber-800">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden text-amber-800">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;