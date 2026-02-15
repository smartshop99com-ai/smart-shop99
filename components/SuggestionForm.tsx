
import React, { useState } from 'react';
import { SHOP_WHATSAPP_NUMBER, SHOP_NAME } from '../constants';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SuggestionForm: React.FC = () => {
  const [suggestion, setSuggestion] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSendSuggestion = async () => {
    if (!suggestion.trim()) {
      setMessage('Please enter a suggestion');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let photoURL = '';

      // Upload photo to Firebase Storage if selected
      if (file) {
        const timestamp = Date.now();
        const storageRef = ref(storage, `suggestions/${timestamp}_${file.name}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      // Save suggestion to Firestore
      await addDoc(collection(db, 'suggestions'), {
        text: suggestion,
        photoURL: photoURL,
        timestamp: serverTimestamp(),
        fileName: fileName || null
      });

      // Send to WhatsApp as well
      const message = `Hi ${SHOP_NAME}! I was looking for a product but couldn't find it. My suggestion: ${suggestion}`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

      // Success message
      setMessage('✅ Suggestion sent! Thank you!');
      setSuggestion('');
      setFile(null);
      setFileName('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error sending suggestion. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-blue-50 py-12 px-4 rounded-3xl container mx-auto my-12">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Don't see what you want?</h2>
        <p className="text-gray-600 mb-8">Suggest a product and we'll try to get it in stock for you!</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="What items would you like us to add? (e.g. 5L Water Bottle, specific brand of snacks...)"
            className="w-full p-4 border border-gray-200 rounded-xl mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
          ></textarea>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full text-left">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Upload Photo (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileSelect}
                disabled={loading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" 
              />
              {fileName && <p className="text-xs text-green-600 mt-1">✓ {fileName}</p>}
            </div>
            <button
              onClick={handleSendSuggestion}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Suggestion'}
            </button>
          </div>

          {message && (
            <p className={`mt-4 text-sm font-semibold ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SuggestionForm;
