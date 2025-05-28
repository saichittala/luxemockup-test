"use client"; // Mark this component as a client component

import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import UPNG from 'upng-js';


function ConvertToPng() {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  // const seoConfig = {
  //   title: "Convert to PNG - Free Online Image Converter | SnapIMG",
  //   description:
  //     "Convert images to PNG format online for free. Drag and drop your JPG, WEBP, or GIF files and download high-quality PNG images instantly.",
  //   canonicalUrl: "https://www.snapimg.site/convertpng",
  //   keywords: [
  //     "convert to PNG",
  //     "PNG converter",
  //     "online PNG converter",
  //     "free PNG converter",
  //     "convert JPG to PNG",
  //     "convert WEBP to PNG",
  //     "convert GIF to PNG",
  //     "best PNG converter online",
  //     "high-quality PNG converter",
  //     "image to PNG converter",
  //     "convert images to PNG format",
  //     "transparent PNG converter",
  //     "fast PNG converter tool",
  //     "bulk PNG conversion online",
  //     "instant PNG converter",
  //     "JPG to PNG converter free",
  //     "SnapIMG PNG conversion",
  //     "PNG format converter free",
  //     "best free image converter"
  //   ],
  //   structuredData: {
  //     "@context": "https://schema.org",
  //     "@type": "HowTo",
  //     name: "How to Convert Images to PNG Format",
  //     description: "Learn how to convert images to PNG format using SnapIMG.",
  //     step: [
  //       {
  //         "@type": "HowToStep",
  //         text: "Upload your image in JPG, WEBP, or GIF format.",
  //       },
  //       {
  //         "@type": "HowToStep",
  //         text: "Click 'Convert to PNG' to process the image.",
  //       },
  //       {
  //         "@type": "HowToStep",
  //         text: "Download the converted PNG image.",
  //       },
  //     ],
  //   },
  // };
  

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    if (!e.target.files.length) return; // Ensure files are selected

    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Reset the input field to allow re-uploading the same files
    e.target.value = "";
  }, []);


  // Helper function to format file size
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Function to calculate total size of uploaded images
  const getTotalSize = () => files.reduce((total, file) => total + file.size, 0);

  // Convert image to PNG
  const convertImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pngBuffer = UPNG.encode(
          [imageData.data.buffer],
          canvas.width,
          canvas.height,
          256 // Number of colors (0 = lossless, 256 = lossy)
        );

        const blob = new Blob([pngBuffer], { type: 'image/png' });
        resolve(blob);
        URL.revokeObjectURL(url);
      };

      img.onerror = (err) => {
        reject(new Error('Error loading image.'));
        URL.revokeObjectURL(url);
      };
    });
  }, []);

  // Generate output file name
  const getOutputName = useCallback((originalName) => {
    return originalName.replace(/\.[^/.]+$/, '') + '_converted.png'; // Change extension to PNG
  }, []);

  // Download processed files
  const downloadProcessedFiles = useCallback(async () => {
    if (processedFiles.length === 0) {
      alert('No processed files to download.');
      return;
    }

    if (processedFiles.length === 1) {
      const file = processedFiles[0];
      console.log('Downloading:', file.name);
      saveAs(new Blob([file.blob], { type: 'image/png' }), getOutputName(file.name)); // Change MIME type to PNG
    } else {
      const zip = new JSZip();
      for (const file of processedFiles) {
        zip.file(getOutputName(file.name), file.blob, { binary: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      console.log('Downloading ZIP:', content);
      saveAs(content, 'snapimg-converted-images.zip');
    }

    // Reset UI
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
  }, [processedFiles, getOutputName]);

  // Process all images
  const processImages = useCallback(async () => {
    if (!files || files.length === 0) {
      alert('No files selected. Please upload images first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const supportedTypes = ['image/png', 'image/webp', 'image/gif', 'image/jpeg'];
    const totalFiles = files.length;
    let processedCount = 0;
    const newProcessedFiles = [];

    for (let file of files) {
      if (!supportedTypes.includes(file.type)) {
        alert(`Unsupported file type: ${file.name}. Only PNG, WEBP, GIF, and JPEG allowed.`);
        continue;
      }

      try {
        // Skip conversion if the file is already a PNG
        if (file.type === 'image/png') {
          newProcessedFiles.push({ blob: file, name: file.name });
        } else {
          const processedBlob = await convertImage(file);
          newProcessedFiles.push({ blob: processedBlob, name: file.name });
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }

      processedCount++;
      setProgress(Math.floor((processedCount / totalFiles) * 100));
    }

    setProcessedFiles(newProcessedFiles);
    setIsProcessing(false);
    setIsProcessed(newProcessedFiles.length > 0);

    if (newProcessedFiles.length > 0) {
      // alert('Processing complete! You can now download the files.');
    } else {
      alert('No valid images were processed.');
    }
  }, [files, convertImage]);

  // Delete a file from the list
  const deleteFile = useCallback((index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file));
    };
  }, [files]);

  useEffect(() => {
    const dropZone = document.getElementById('drop-zone');

    const handleDragOver = (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    };

    const handleDragLeave = () => {
      dropZone.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  const resetState = () => {
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessed(false);
  };

  return (
    <div>
      {/* <Seo {...seoConfig} /> */}
      <div className="tool-container">
        <div className="tool-header">
          <h1>Convert to PNG</h1> {/* Update title */}
          <p className="heading-desc">
            Drag and drop your images below to convert them to PNG format {/* Update description */}
          </p>
        </div>

        <div className='main-container-div' id="drop-zone">
          <div className='middle-container'>
            <div className="upload-section" >
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileInputChange}
                hidden
              />
              <div
                className="upload-content"
                onClick={() => document.getElementById('file-input').click()}
              >
                <img src="/img/upload.svg" alt="Upload" className="upload-icon" />
                <h3>Drag & Drop Images</h3>
                <p>or click to browse files</p>
                <p className="support-text">Supports: PNG, WEBP, GIF, JPEG</p> {/* Update supported formats */}
              </div>
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <div className="image-preview-main">
                <div className='image-preview-sub'>
                  <h3>Uploaded Images</h3>
                  <div className="file-counter">
                    {files.length} files uploaded | {formatFileSize(getTotalSize())}
                  </div>
                </div>
                <div className='image-preview-grid'>
                  {files.map((file, index) => (
                    <div key={index} className="preview-item">
                      <span className='filesize-img'>{formatFileSize(file.size)}</span>

                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="preview-image"
                      />
                      <button
                        className="delete-btn"
                        onClick={() => deleteFile(index)}
                      >
                        <img src="/img/delete-btn.svg" alt="Delete" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='right-options-container'>
            <div>
              <h3 className='right-options-heading'>Progress</h3>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-text" id="progress-text">
                  {progress}% Completed
                </div>
              </div>
            </div>

            <div>
              <h3 className='right-options-heading'>Actions</h3>
              <div className="action-bar">
                {!isProcessed ? (
                  <button className="btn-4" onClick={processImages} disabled={isProcessing || files.length === 0}>
                    {isProcessing ? 'Processing...' : 'Convert to PNG'}
                  </button>
                ) : (
                  <button className="btn-4" onClick={downloadProcessedFiles}>
                    Download
                  </button>
                )}
                {isProcessed && (
                  <button className="btn-2" onClick={resetState}>
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default ConvertToPng;