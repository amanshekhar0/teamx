import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

function NoticeSummarizer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleBroadcast = async () => {
    if (!text) return;
    setLoading(true);
    setSummary(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/notice', { raw_text: text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let summaryData = ['Check execution logs'];
      if (res.data.summary) {
        summaryData = Array.isArray(res.data.summary) ? res.data.summary : [res.data.summary];
      }
      setSummary({ 
        message: res.data.message || "Notice summarized and broadcasted", 
        data: summaryData 
      });

      if (window.addLog) {
        window.addLog('Process Notice', 'success', summaryData.join('\n'));
      }
      setText(''); 
    } catch (error) {
      console.error(error);
      if (window.addLog) window.addLog('Process Notice', 'error', error.response?.data?.error || 'Summarization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          className="w-full h-36 p-4 bg-brand-bg border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all outline-none text-sm resize-none placeholder-brand-textMuted/50 leading-relaxed"
          placeholder="Paste the raw college notice here..."
          value={text}
          onChange={e => setText(e.target.value)}
        ></textarea>
        <div className="absolute bottom-3 right-3 text-xs text-brand-textMuted bg-brand-surface px-2 py-1 rounded-md border border-brand-border">
          {text.length} chars
        </div>
      </div>
      
      <button
        onClick={handleBroadcast}
        disabled={loading || !text}
        className="w-full flex justify-center items-center space-x-2 bg-brand-text text-brand-bg py-3 flex-shrink-0 rounded-xl font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group hover:bg-brand-primary hover:text-white"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        )}
        <span>{loading ? 'Synthesizing Data...' : 'Summarize & Broadcast'}</span>
      </button>

      {summary && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-4 p-5 bg-brand-primary/5 border border-brand-primary/20 rounded-xl overflow-hidden text-sm"
        >
          <p className="font-semibold mb-3 text-brand-primary flex items-center space-x-2">
            <Sparkles size={16} /> <span>AI Summary Extracted:</span>
          </p>
          <ul className="space-y-2">
            {summary.data.map((point, i) => (
              <li key={i} className="flex items-start space-x-2 text-brand-text">
                <span className="text-brand-primary mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

import { Sparkles } from 'lucide-react'; // Make sure this is imported at top actually, adding it here for simplicity
export default NoticeSummarizer;
