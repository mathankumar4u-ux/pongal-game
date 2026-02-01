import { useState } from 'react';
import { Button } from '../common';
import { ANSWER_OPTIONS } from '../../utils/constants';

export function QuestionForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    text: initialData?.text || '',
    options: initialData?.options || { A: '', B: '', C: '', D: '' },
    correctAnswer: initialData?.correctAnswer || 'A'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.text.trim()) {
      setError('Question text is required');
      return;
    }

    for (const opt of ANSWER_OPTIONS) {
      if (!formData.options[opt].trim()) {
        setError(`Option ${opt} is required`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      // Close form on success
      onCancel();
    } catch (err) {
      setError(err.message || 'Failed to save question');
      setLoading(false);
    }
  };

  const handleOptionChange = (option, value) => {
    setFormData(prev => ({
      ...prev,
      options: { ...prev.options, [option]: value }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-maroon mb-4">
          {initialData ? 'Edit Question' : 'Add Question'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Question text */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Question Text
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/50 outline-none resize-none text-gray-900 bg-white"
              rows={3}
              placeholder="Enter your question..."
            />
          </div>

          {/* Options */}
          {ANSWER_OPTIONS.map((opt) => (
            <div key={opt} className="mb-3">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Option {opt}
              </label>
              <input
                type="text"
                value={formData.options[opt]}
                onChange={(e) => handleOptionChange(opt, e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/50 outline-none text-gray-900 bg-white"
                placeholder={`Enter option ${opt}...`}
              />
            </div>
          ))}

          {/* Correct answer */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Correct Answer
            </label>
            <div className="flex gap-4">
              {ANSWER_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={opt}
                    checked={formData.correctAnswer === opt}
                    onChange={() => setFormData(prev => ({ ...prev, correctAnswer: opt }))}
                    className="w-4 h-4 text-gold focus:ring-gold"
                  />
                  <span className="font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {initialData ? 'Update' : 'Add'} Question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
