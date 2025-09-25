
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@africariseesports.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+234 123 456 7890',
      description: 'Call us during business hours'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Lagos, Nigeria',
      description: 'Our headquarters location'
    }
  ];

  const faqs = [
    {
      question: 'How do I register for tournaments?',
      answer: 'You can register for tournaments by creating an account and browsing our tournaments page. Click on any tournament to view details and registration options.'
    },
    {
      question: 'What games do you support?',
      answer: 'We currently support FIFA, Mobile Legends, Call of Duty Warzone, Valorant, Fortnite, and Apex Legends. We\'re constantly adding new games based on community demand.'
    },
    {
      question: 'How do I join a team?',
      answer: 'You can create your own team or join existing teams through our team management system. Check out the Teams section in your dashboard after signing up.'
    },
    {
      question: 'Are tournaments free to enter?',
      answer: 'Most of our tournaments are free to enter. Some premium tournaments may have entry fees, which are clearly stated in the tournament details.'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions, suggestions, or want to partner with us? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Send className="mr-3 text-primary-500" size={24} />
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="tournament">Tournament Question</option>
                  <option value="technical">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="input-field"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full">
                <Send className="mr-2" size={16} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageCircle className="mr-3 text-primary-500" size={24} />
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-500 mt-1" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">{info.title}</h3>
                        <p className="text-primary-400 font-medium">{info.value}</p>
                        <p className="text-gray-400 text-sm">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="mr-2 text-primary-500" size={20} />
                Response Time
              </h3>
              <p className="text-gray-300 mb-2">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
              <p className="text-gray-400 text-sm">
                Business Hours: Monday - Friday, 9:00 AM - 6:00 PM (WAT)
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="card">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-primary-400">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
