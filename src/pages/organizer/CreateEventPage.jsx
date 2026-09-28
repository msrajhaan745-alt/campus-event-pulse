import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  FileText, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { eventService } from '../../services/eventService';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { CATEGORIES } from '../../components/events/EventFilters';
import { getFriendlyErrorMessage } from '../../utils/errorHandler';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    date: '',
    time: '10:00',
    venue: '',
    seatLimit: '50',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.category.trim()) newErrors.category = 'Category is required.';
    if (!formData.date.trim()) newErrors.date = 'Date is required.';
    if (!formData.time.trim()) newErrors.time = 'Time is required.';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required.';

    const seatNum = parseInt(formData.seatLimit, 10);
    if (isNaN(seatNum) || seatNum <= 0) {
      newErrors.seatLimit = 'Seat limit must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await eventService.createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        time: formData.time.length === 5 ? `${formData.time}:00` : formData.time,
        venue: formData.venue.trim(),
        seatLimit: parseInt(formData.seatLimit, 10),
      });

      success('Event created successfully! Saved as Draft.');
      navigate('/organizer/events');
    } catch (err) {
      console.error('Create event error:', err);
      toastError(getFriendlyErrorMessage(err, 'Failed to create event.'));
    } finally {
      setLoading(false);
    }
  };

  const selectableCategories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Back Link */}
      <Link
        to="/organizer/events"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#0f1117] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Events Management</span>
      </Link>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl border border-[#e4e7ef] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-[#e4e7ef] bg-gradient-to-r from-slate-50/60 via-white to-indigo-50/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] border border-[#c7d2fe] text-xs font-semibold text-[#4f46e5] mb-2">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Campus Event</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1117] tracking-tight">
            Create Campus Event
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            New events will be initially saved as <strong className="text-[#0f1117]">Draft</strong>. You can review and publish whenever ready.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
              Event Title *
            </label>
            <input
              type="text"
              placeholder="e.g. AI & Machine Learning Workshop 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] ${
                errors.title ? 'border-red-300 bg-red-50/40' : 'border-[#e4e7ef] bg-[#f8f9fc]'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
              Event Description *
            </label>
            <textarea
              rows={4}
              placeholder="Provide a detailed overview of the event, agenda, prerequisites, and student takeaways..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] ${
                errors.description ? 'border-red-300 bg-red-50/40' : 'border-[#e4e7ef] bg-[#f8f9fc]'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Category & Seat Limit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e4e7ef] text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] bg-[#f8f9fc]"
              >
                {selectableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                Seat Capacity Limit *
              </label>
              <input
                type="number"
                min="1"
                placeholder="50"
                value={formData.seatLimit}
                onChange={(e) => setFormData({ ...formData, seatLimit: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] ${
                  errors.seatLimit ? 'border-red-300 bg-red-50/40' : 'border-[#e4e7ef] bg-[#f8f9fc]'
                }`}
              />
              {errors.seatLimit && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.seatLimit}</p>
              )}
            </div>
          </div>

          {/* Date, Time, Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] ${
                  errors.date ? 'border-red-300 bg-red-50/40' : 'border-[#e4e7ef] bg-[#f8f9fc]'
                }`}
              />
              {errors.date && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] ${
                  errors.time ? 'border-red-300 bg-red-50/40' : 'border-[#e4e7ef] bg-[#f8f9fc]'
                }`}
              />
              {errors.time && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.time}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                Venue Location *
              </label>
              <input
                type="text"
                placeholder="e.g. CS Lab 101, Main Auditorium"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] ${
                  errors.venue ? 'border-red-300 bg-red-50/40' : 'border-[#e4e7ef] bg-[#f8f9fc]'
                }`}
              />
              {errors.venue && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.venue}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-[#f1f3f8] flex items-center justify-end gap-3">
            <Link
              to="/organizer/events"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#e4e7ef] text-[#6b7280] hover:text-[#0f1117] hover:bg-[#f8f9fc] transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
            >
              Save Event (Draft)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;
