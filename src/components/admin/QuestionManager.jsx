import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { addQuestion, deleteQuestion } from '../../services/adminService';
import { QuestionForm } from './QuestionForm';
import { Button, LoadingSpinner } from '../common';
import { clsx } from 'clsx';

export function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'questions'),
      orderBy('questionNumber', 'asc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const questionList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddQuestion = async (questionData) => {
    // Close form immediately for better UX
    setShowForm(false);
    try {
      await addQuestion(questionData);
    } catch (err) {
      console.error('Failed to add question:', err);
      alert('Failed to add question: ' + err.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(questionId);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-maroon">
          Questions ({questions.length})
        </h2>
        <Button
          onClick={() => setShowForm(true)}
          size="small"
        >
          + Add Question
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-8" />
      ) : questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No questions added yet.</p>
          <p className="text-sm mt-1">Add some questions to get started!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {questions.map((question) => (
            <div
              key={question.id}
              className={clsx(
                "p-4 rounded-lg border",
                question.isActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-500">
                      Q{question.questionNumber}
                    </span>
                    {question.isActive && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-800 mb-2">
                    {question.text}
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                    <span>A: {question.options.A}</span>
                    <span>B: {question.options.B}</span>
                    <span>C: {question.options.C}</span>
                    <span>D: {question.options.D}</span>
                  </div>
                  <p className="mt-2 text-sm text-green-600 font-medium">
                    Correct: {question.correctAnswer}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  disabled={question.isActive}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question form modal */}
      {showForm && (
        <QuestionForm
          onSubmit={handleAddQuestion}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
