'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionStatus, RiskLevel } from '@prisma/client';

interface FeedbackFormProps {
  sessionId: string;
  currentStatus: SessionStatus;
}

export default function FeedbackForm({
  sessionId,
  currentStatus,
}: FeedbackFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState<SessionStatus | ''>('');
  const [overrideRisk, setOverrideRisk] = useState<RiskLevel | ''>('');
  const [notes, setNotes] = useState('');
  const [supervisorName, setSupervisorName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          validated,
          rejected,
          overrideStatus: overrideStatus || null,
          overrideRisk: overrideRisk || null,
          notes,
          supervisorName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Reset form
      setValidated(false);
      setRejected(false);
      setOverrideStatus('');
      setOverrideRisk('');
      setNotes('');
      setSupervisorName('');

      // refresh the page to show updated feedback
      router.refresh();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Supervisor Review
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* supervisor name */}
        <div>
          <label
            htmlFor="supervisorName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="supervisorName"
            value={supervisorName}
            onChange={(e) => setSupervisorName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
            placeholder="Enter your name"
          />
        </div>

        {/* validation checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={validated}
              onChange={(e) => setValidated(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Validate AI findings
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rejected}
              onChange={(e) => setRejected(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Reject AI findings
            </span>
          </label>
        </div>

        {/* override status */}
        <div>
          <label
            htmlFor="overrideStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Override Session Status
          </label>
          <select
            id="overrideStatus"
            value={overrideStatus}
            onChange={(e) =>
              setOverrideStatus(e.target.value as SessionStatus | '')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
          >
            <option value="">No override (current: {currentStatus})</option>
            <option value="SAFE">Safe</option>
            <option value="FLAGGED_FOR_REVIEW">Flagged for Review</option>
            <option value="PROCESSED">Processed</option>
            <option value="NEEDS_FOLLOWUP">Needs Follow-up</option>
          </select>
        </div>

        {/* Override Risk */}
        <div>
          <label
            htmlFor="overrideRisk"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Override Risk Assessment
          </label>
          <select
            id="overrideRisk"
            value={overrideRisk}
            onChange={(e) => setOverrideRisk(e.target.value as RiskLevel | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
          >
            <option value="">No override</option>
            <option value="SAFE">Safe</option>
            <option value="RISK">Risk</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Supervisor Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-sm"
            placeholder="Add any additional observations or concerns"
          />
        </div>

        {/* submit btn   */}
        <button
          type="submit"
          disabled={isSubmitting || !supervisorName}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
