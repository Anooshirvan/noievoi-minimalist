
import React, { useState } from 'react';
import { useAdmin, ChatbotQuestion, ChatbotCharacter } from '../contexts/AdminContext';
import { X, Plus, Save, Trash2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ChatbotSettingsTab: React.FC = () => {
  const { chatbotConfig, updateChatbotConfig, updateChatbotQuestion, addChatbotQuestion, deleteChatbotQuestion } = useAdmin();
  const [editing, setEditing] = useState<ChatbotQuestion | null>(null);
  const [adding, setAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ id: '', question: '', answer: '' });

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    updateChatbotConfig({
      ...chatbotConfig,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    });
  };

  const handleCharacterSelect = (characterId: string) => {
    updateChatbotConfig({
      ...chatbotConfig,
      selectedCharacter: characterId
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (editing) {
      setEditing({
        ...editing,
        [name]: value
      });
    } else {
      setNewQuestion({
        ...newQuestion,
        [name]: value
      });
    }
  };

  const saveQuestion = () => {
    if (editing) {
      updateChatbotQuestion(editing);
      setEditing(null);
      toast.success('Question updated successfully');
    } else {
      const id = `q-${Date.now()}`;
      const questionToAdd = { ...newQuestion, id };
      addChatbotQuestion(questionToAdd);
      setNewQuestion({ id: '', question: '', answer: '' });
      setAdding(false);
      toast.success('Question added successfully');
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteChatbotQuestion(id);
      toast.success('Question deleted successfully');
    }
  };

  return (
    <div className="admin-section">
      <h2 className="text-xl font-medium mb-6">Chatbot Settings</h2>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="chatbot-enabled"
            name="enabled"
            checked={chatbotConfig.enabled}
            onChange={handleConfigChange}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="chatbot-enabled" className="ml-2 block text-sm">
            Enable Chatbot
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Welcome Message</label>
          <textarea
            name="welcomeMessage"
            value={chatbotConfig.welcomeMessage}
            onChange={handleConfigChange}
            rows={2}
            className="admin-form-input"
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Chatbot Character</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select a character to represent your chatbot
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chatbotConfig.characters.map(character => (
            <div 
              key={character.id}
              onClick={() => handleCharacterSelect(character.id)}
              className={`cursor-pointer border rounded-lg p-4 transition-all ${
                chatbotConfig.selectedCharacter === character.id
                  ? 'border-black ring-2 ring-black ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src={character.avatarUrl}
                    alt={character.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">{character.name}</h4>
                  <p className="text-sm text-gray-500 capitalize">{character.gender}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Character Name</label>
          <div className="max-w-xs">
            <Input
              name="characterName"
              value={chatbotConfig.characters.find(c => c.id === chatbotConfig.selectedCharacter)?.name || ''}
              onChange={(e) => {
                const updatedCharacters = chatbotConfig.characters.map(char => 
                  char.id === chatbotConfig.selectedCharacter 
                    ? { ...char, name: e.target.value }
                    : char
                );
                updateChatbotConfig({
                  ...chatbotConfig,
                  characters: updatedCharacters
                });
              }}
              className="admin-form-input"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Questions & Answers</h3>
          {!adding && !editing && (
            <Button 
              onClick={() => setAdding(true)}
              size="sm"
              className="flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Question
            </Button>
          )}
        </div>
        
        {(editing || adding) && (
          <div className="mb-6 border p-4 rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">{editing ? 'Edit Question' : 'Add New Question'}</h4>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Question</label>
              <Input
                name="question"
                value={editing ? editing.question : newQuestion.question}
                onChange={handleQuestionChange}
                placeholder="Enter question"
                className="admin-form-input"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Answer</label>
              <textarea
                name="answer"
                value={editing ? editing.answer : newQuestion.answer}
                onChange={handleQuestionChange}
                rows={3}
                placeholder="Enter answer"
                className="admin-form-input"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={cancelEdit}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={saveQuestion}
                size="sm"
                disabled={
                  editing 
                    ? !editing.question.trim() || !editing.answer.trim()
                    : !newQuestion.question.trim() || !newQuestion.answer.trim()
                }
              >
                <Save size={16} className="mr-1" /> Save
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {chatbotConfig.questions.map(question => (
            <div 
              key={question.id} 
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <MessageCircle size={20} className="text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium">{question.question}</h4>
                    <p className="text-gray-600 mt-1">{question.answer}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditing(question)}
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {chatbotConfig.questions.length === 0 && !adding && (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No questions added yet.</p>
              <Button 
                onClick={() => setAdding(true)}
                variant="outline"
                className="mt-2"
              >
                <Plus size={16} className="mr-1" /> Add Your First Question
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotSettingsTab;
