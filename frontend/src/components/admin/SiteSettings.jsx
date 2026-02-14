import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const SiteSettings = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    siteName: { ar: 'مُسلمة', en: 'Muslima' },
    description: { ar: 'متجر الأزياء الشرعية الأول', en: 'The first modest fashion store' },
    contactEmail: 'info@muslima.com',
    contactPhone: '+966501234567',
    address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
    bankDetails: { bankName: 'البنك الأهلي السعودي', accountNumber: '1234567890', iban: 'SA123456789012345678901234' },
    shippingFee: 25,
    freeShippingLimit: 500,
    enableCOD: true,
    enableBankTransfer: true,
    enableVisa: true,
    maintenanceMode: false,
  });

  const handleSaveSettings = () => {
    toast({
      title: language === 'ar' ? 'تم الحفظ' : 'Saved',
      description: language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-amber-900">
            {language === 'ar' ? 'إعدادات الموقع العامة' : 'General Site Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{language === 'ar' ? 'اسم الموقع (عربي)' : 'Site Name (Arabic)'}</Label>
              <Input
                value={settings.siteName.ar}
                onChange={(e) => setSettings({ ...settings, siteName: { ...settings.siteName, ar: e.target.value } })}
              />
            </div>
            <div>
              <Label>{language === 'ar' ? 'اسم الموقع (إنجليزي)' : 'Site Name (English)'}</Label>
              <Input
                value={settings.siteName.en}
                onChange={(e) => setSettings({ ...settings, siteName: { ...settings.siteName, en: e.target.value } })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{language === 'ar' ? 'وصف الموقع (عربي)' : 'Site Description (Arabic)'}</Label>
              <Textarea
                value={settings.description.ar}
                onChange={(e) => setSettings({ ...settings, description: { ...settings.description, ar: e.target.value } })}
              />
            </div>
            <div>
              <Label>{language === 'ar' ? 'وصف الموقع (إنجليزي)' : 'Site Description (English)'}</Label>
              <Textarea
                value={settings.description.en}
                onChange={(e) => setSettings({ ...settings, description: { ...settings.description, en: e.target.value } })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{language === 'ar' ? 'البريد الإلكتروني للتواصل' : 'Contact Email'}</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-amber-900">
            {language === 'ar' ? 'إعدادات الدفع والشحن' : 'Payment & Shipping Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>{language === 'ar' ? 'اسم البنك' : 'Bank Name'}</Label>
              <Input
                value={settings.bankDetails.bankName}
                onChange={(e) => setSettings({ ...settings, bankDetails: { ...settings.bankDetails, bankName: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'رقم الحساب' : 'Account Number'}</Label>
                <Input
                  value={settings.bankDetails.accountNumber}
                  onChange={(e) => setSettings({ ...settings, bankDetails: { ...settings.bankDetails, accountNumber: e.target.value } })}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'رقم الآيبان' : 'IBAN'}</Label>
                <Input
                  value={settings.bankDetails.iban}
                  onChange={(e) => setSettings({ ...settings, bankDetails: { ...settings.bankDetails, iban: e.target.value } })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'رسوم الشحن' : 'Shipping Fee'}</Label>
                <Input
                  type="number"
                  value={settings.shippingFee}
                  onChange={(e) => setSettings({ ...settings, shippingFee: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>{language === 'ar' ? 'حد الشحن المجاني' : 'Free Shipping Limit'}</Label>
                <Input
                  type="number"
                  value={settings.freeShippingLimit}
                  onChange={(e) => setSettings({ ...settings, freeShippingLimit: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{language === 'ar' ? 'تفعيل الدفع عند الاستلام' : 'Enable Cash on Delivery'}</Label>
                <Switch checked={settings.enableCOD} onCheckedChange={(checked) => setSettings({ ...settings, enableCOD: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>{language === 'ar' ? 'تفعيل التحويل البنكي' : 'Enable Bank Transfer'}</Label>
                <Switch checked={settings.enableBankTransfer} onCheckedChange={(checked) => setSettings({ ...settings, enableBankTransfer: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>{language === 'ar' ? 'تفعيل الفيزا' : 'Enable Visa Payment'}</Label>
                <Switch checked={settings.enableVisa} onCheckedChange={(checked) => setSettings({ ...settings, enableVisa: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>{language === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}</Label>
                <Switch checked={settings.maintenanceMode} onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} className="bg-amber-600 hover:bg-amber-700">
        {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
      </Button>
    </div>
  );
};

export default SiteSettings;
