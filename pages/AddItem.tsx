import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Check, Loader2, Eraser, RotateCcw } from 'lucide-react';
import { analyzeImage, removeBackground } from '../services/geminiService';
import { useWardrobe } from '../context/WardrobeContext';
import { Category, Season } from '../types';

export const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useWardrobe();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'preview' | 'details'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsRemovingBackground(true);
    
    try {
        const newImage = await removeBackground(image);
        setImage(newImage);
    } catch (e) {
        alert("Could not remove background. Try again or skip this step.");
    } finally {
        setIsRemovingBackground(false);
    }
  };

  const handleUndoBackground = () => {
      if (originalImage) {
          setImage(originalImage);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Create an image object to resize it
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_SIZE = 800; // Constrain max dimension to 800px

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Compress to JPEG with 0.7 quality to save space
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                setImage(compressedBase64);
                setOriginalImage(compressedBase64);
                setStep('preview');
            }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Reset input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
        const result = await analyzeImage(image);
        setAnalysis(result);
        setStep('details');
    } catch (error) {
        alert("Failed to analyze image. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!image || !analysis) return;

    addItem({
        id: Date.now().toString(),
        imageUrl: image,
        originalImageUrl: originalImage || undefined,
        category: analysis.category as Category,
        subCategory: analysis.subCategory,
        color: analysis.colors,
        season: analysis.seasons as Season[],
        tags: analysis.tags,
        dateAdded: Date.now()
    });

    navigate('/wardrobe');
  };

  if (step === 'upload') {
    return (
      <div className="h-screen bg-black text-white flex flex-col relative">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 z-10"><X /></button>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
            <h2 className="text-2xl font-light">Add to Wardrobe</h2>
            
            <div className="w-full max-w-sm space-y-4">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2"
                >
                    <Upload size={20} /> Upload Photo
                </button>
                <button className="w-full py-4 bg-[#333] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                    <Camera size={20} /> Take Photo
                </button>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    const isModified = image !== originalImage;

    return (
        <div className="h-screen bg-[#f8f8f8] flex flex-col relative">
             <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
                <button onClick={() => setStep('upload')} className="p-2 bg-white/80 rounded-full shadow"><X size={20} /></button>
             </div>

             <div className="flex-1 flex items-center justify-center p-8">
                <div className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isRemovingBackground ? 'opacity-50 blur-sm' : ''}`}>
                    <img src={image!} alt="Preview" className="max-h-[60vh] object-contain bg-white" />
                </div>
                {isRemovingBackground && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/70 text-white px-6 py-3 rounded-full flex items-center gap-2">
                            <Loader2 className="animate-spin" /> Removing Background...
                        </div>
                    </div>
                )}
             </div>

             <div className="bg-white p-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex gap-4">
                    {isModified ? (
                        <button 
                            onClick={handleUndoBackground}
                            disabled={isRemovingBackground}
                            className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-gray-200"
                        >
                            <RotateCcw size={20} />
                            <span className="text-xs">Undo</span>
                        </button>
                    ) : (
                        <button 
                            onClick={handleRemoveBackground}
                            disabled={isRemovingBackground}
                            className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-gray-200"
                        >
                            <Eraser size={20} />
                            <span className="text-xs">Remove BG</span>
                        </button>
                    )}
                    
                    <button 
                        onClick={processImage}
                        disabled={isAnalyzing}
                        className="flex-[2] py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900"
                    >
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <>Identify & Save <Check size={18} /></>}
                    </button>
                </div>
             </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
         <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
            <button onClick={() => setStep('preview')}><X /></button>
            <h1 className="font-bold">Item Details</h1>
            <button onClick={handleSave} className="text-[#ccff00] bg-black px-4 py-1.5 rounded-full text-sm font-bold">Save</button>
         </div>

         <div className="p-6 space-y-6">
            <div className="flex gap-4">
                <div className="w-32 h-32 bg-gray-50 rounded-lg p-2 border flex items-center justify-center">
                    <img src={image!} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 space-y-2">
                    <label className="text-xs text-gray-500 uppercase font-bold">Category</label>
                    <div className="p-3 bg-gray-50 rounded-lg font-medium">{analysis?.category}</div>
                    
                    <label className="text-xs text-gray-500 uppercase font-bold">Sub-Category</label>
                    <input 
                        defaultValue={analysis?.subCategory} 
                        className="w-full p-3 bg-gray-50 rounded-lg font-medium border-none focus:ring-2 ring-black/10"
                    />
                </div>
            </div>

            <div>
                <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Description</label>
                <p className="text-sm text-gray-700 italic bg-purple-50 p-3 rounded-lg border border-purple-100">
                    "{analysis?.styleDescription}"
                </p>
            </div>

            <div>
                 <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Colors</label>
                 <div className="flex flex-wrap gap-2">
                    {analysis?.colors.map((c: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{c}</span>
                    ))}
                 </div>
            </div>

            <div>
                 <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Seasons</label>
                 <div className="flex flex-wrap gap-2">
                    {analysis?.seasons.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-100">{s}</span>
                    ))}
                 </div>
            </div>

            <div>
                 <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Tags</label>
                 <div className="flex flex-wrap gap-2">
                    {analysis?.tags.map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1 border border-gray-200 rounded-full text-sm text-gray-600">#{t}</span>
                    ))}
                 </div>
            </div>
         </div>
    </div>
  );
};