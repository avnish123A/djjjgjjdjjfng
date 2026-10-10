import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Send, Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { validContactEmail, validContactPhone, telHref } from '@/lib/contact';

const ContactUs = () => {
  const { data: settings = {} } = useSiteSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Only show values that are exactly one well-formed entry; never invent fallbacks.
  const email = validContactEmail(settings['contact_email']);
  const phone = validContactPhone(settings['contact_phone']);
  const address = (settings['contact_location'] || '').trim();
  const pageTitle = settings['contact_page_title'] || 'Get in Touch';
  const pageDescription = settings['contact_page_description'] || 'Have a question or need help with an order? Send us a message.';
  const businessHours = (settings['contact_business_hours'] || '').trim();
  const offDay = (settings['contact_off_day'] || '').trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email) return;

    if (!form.email || !form.message.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(form.subject || 'Contact Form')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`)}`;
    window.open(mailtoLink, '_blank');
    
    toast({ title: 'Opening your email app', description: 'Send your message from there.' });
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Contact Us</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">{pageTitle}</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">{pageDescription}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Contact Information
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                {email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href={`mailto:${email}`} className="text-primary hover:underline break-all">{email}</a>
                  </div>
                </div>
                )}
                {phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a href={telHref(phone)} className="hover:underline">{phone}</a>
                  </div>
                </div>
                )}
                {address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p>{address}</p>
                  </div>
                </div>
                )}
                {(businessHours || offDay) && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Business Hours</p>
                    {businessHours && <p>{businessHours}</p>}
                    {offDay && <p>{offDay}</p>}
                  </div>
                </div>
                )}
                {!email && !phone && (
                  <p>Contact details are being updated. Please check back soon.</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Your name" maxLength={200} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required maxLength={255} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" maxLength={20} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <Input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" maxLength={200} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Message <span className="text-destructive">*</span></label>
                <Textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what you need help with..." required rows={5} maxLength={5000} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactUs;