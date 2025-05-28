"use client"; // Mark this component as a client component

import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ProcessedFile {
  blob: Blob;
  name: string;
  size: number;
}



function CompressImages() {
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [quality, setQuality] = useState<number>(60); // Default quality for lossy compression
  const [isLossless, setIsLossless] = useState<boolean>(false); // Toggle for lossless compression
  const [progress, setProgress] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  // const seoConfig = {
  //   title: "Free Image Compressor - Compress Images Online Without Losing Quality | SnapIMG",
  //   description:
  //     "Compress images online for free using SnapIMG. Reduce file size of JPG, PNG, and WebP images with no quality loss. Fast, secure & easy image compression.",
  //   keywords: [
  //     "compress images online",
  //     "image compressor",
  //     "reduce image size",
  //     "compress JPG",
  //     "compress PNG",
  //     "compress WebP",
  //     "online image optimizer",
  //     "free image compression",
  //     "best image compressor",
  //     "reduce image file size"
  //   ],
  //   canonicalUrl: "https://www.snapimg.site/compressimages",
  //   structuredData: {
  //     "@context": "https://schema.org",
  //     "@type": "WebPage",
  //     name: "Compress Images Online - Free Image Compressor",
  //     description: "Use SnapIMG to compress images online instantly without quality loss. Supports JPG, PNG, and WebP formats.",
  //     url: "https://www.snapimg.site/compressimages",
  //     keywords: "compress images online, image compressor, reduce image size, free image compression",
  //     inLanguage: "en",
  //     image: "https://www.snapimg.site/assets/compress-preview.jpg",
  //     isPartOf: {
  //       "@type": "WebSite",
  //       name: "SnapIMG",
  //       url: "https://www.snapimg.site"
  //     },
  //     mainEntity: {
  //       "@type": "HowTo",
  //       name: "How to Compress Images Online",
  //       description: "Follow these steps to compress images online using SnapIMG.",
  //       estimatedCost: "Free",
  //       totalTime: "PT10S",
  //       tool: {
  //         "@type": "SoftwareApplication",
  //         name: "SnapIMG",
  //         operatingSystem: "Web",
  //         applicationCategory: "MultimediaApplication",
  //         offers: {
  //           "@type": "Offer",
  //           price: "0",
  //           priceCurrency: "USD"
  //         }
  //       },
  //       step: [
  //         {
  //           "@type": "HowToStep",
  //           name: "Upload Your Image",
  //           text: "Select or drag and drop JPG, PNG, or WebP files.",
  //           image: "https://www.snapimg.site/assets/step1-upload.jpg"
  //         },
  //         {
  //           "@type": "HowToStep",
  //           name: "Compress Image",
  //           text: "Click ‘Compress’ to reduce file size without quality loss.",
  //           image: "https://www.snapimg.site/assets/step2-compress.jpg"
  //         },
  //         {
  //           "@type": "HowToStep",
  //           name: "Download Compressed Image",
  //           text: "Download and save your optimized image instantly.",
  //           image: "https://www.snapimg.site/assets/step3-download.jpg"
  //         }
  //       ]
  //     }
  //   },
  //   openGraph: {
  //     title: "Compress Images Online - Free & Fast Image Compressor | SnapIMG",
  //     description: "Compress images online for free. Reduce JPG, PNG, or WebP file sizes instantly without losing quality. SnapIMG is the fastest online image compressor.",
  //     url: "https://www.snapimg.site/compressimages",
  //     type: "website",
  //     locale: "en_US",
  //     site_name: "SnapIMG",
  //     images: [
  //       {
  //         url: "https://www.snapimg.site/assets/compress-preview.jpg",
  //         width: 1200,
  //         height: 630,
  //         alt: "Compress Images Online - SnapIMG"
  //       }
  //     ]
  //   },
  //   twitterCard: {
  //     card: "summary_large_image",
  //     title: "Compress Images Online - Free & Fast Image Compressor | SnapIMG",
  //     description: "Reduce image file sizes with SnapIMG’s free image compressor. Supports JPG, PNG, WebP formats. No quality loss!",
  //     image: "https://www.snapimg.site/assets/compress-preview.jpg",
  //     site: "@SnapIMG"
  //   }
  // };
  

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file: File) =>
        ["image/png", "image/webp", "image/gif", "image/jpeg"].includes(file.type)
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Reset input value to allow re-uploading the same files
      e.target.value = "";
    }
  }, []);




  // Helper function to format file size
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Function to calculate total size of uploaded images
  const getTotalSize = (): number => files.reduce((total, file) => total + file.size, 0);

  // Compress image based on quality (lossy) or lossless
  const compressImage = useCallback((file: File, quality: number, isLossless: boolean): Promise<ProcessedFile> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context.'));
          return;
        }
        ctx.drawImage(img, 0, 0);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url); // Cleanup URL
            if (!blob) {
              console.error('Failed to compress image:', file.name);
              reject(new Error('Failed to compress image.'));
              return;
            }
            resolve({ blob, name: file.name, size: blob.size });
          },
          mimeType,
          isLossless ? 1 : quality / 100
        );
      };

      img.onerror = (err) => {
        console.error('Error loading image:', err);
        URL.revokeObjectURL(url); // Ensure cleanup on error
        reject(new Error('Error loading image.'));
      };

      img.src = url; // Set src after event handlers
    });
  }, []);

  // Process all images
  const processImages = useCallback(async () => {
    if (!files || files.length === 0) {
      alert('No files selected. Please upload images first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const totalFiles = files.length;
    let processedCount = 0;
    const newProcessedFiles: ProcessedFile[] = [];

    for (const file of files) { // Changed 'let' to 'const' here
      try {
        const compressedBlob = await compressImage(file, quality, isLossless);
        newProcessedFiles.push(compressedBlob);
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
      // alert('Compression complete! You can now download the files.');
    } else {
      alert('No valid images were processed.');
    }
  }, [files, quality, isLossless, compressImage]);

  // Download processed files
  const downloadProcessedFiles = useCallback(async () => {
    if (processedFiles.length === 0) {
      alert('No processed files to download.');
      return;
    }

    if (processedFiles.length === 1) {
      const file = processedFiles[0];
      saveAs(file.blob, `compressed_${file.name}`);
    } else {
      const zip = new JSZip();
      for (const file of processedFiles) {
        zip.file(`compressed_${file.name}`, file.blob, { binary: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'compressed-images.zip');
    }

    // Reset UI
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessed(false);
  }, [processedFiles]);

  // Delete a file from the list
  const deleteFile = useCallback((index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  // Reset the entire state
  const resetState = () => {
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessed(false);
  };

  // Cleanup object URLs
  useEffect(() => {
    const objectUrls = files.map(file => URL.createObjectURL(file));
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    const dropZone = document.getElementById('drop-zone');

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      dropZone?.classList.add('drag-over');
    };

    const handleDragLeave = () => {
      dropZone?.classList.remove('drag-over');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dropZone?.classList.remove('drag-over');

      if (e.dataTransfer?.files) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      }
    };

    dropZone?.addEventListener('dragover', handleDragOver);
    dropZone?.addEventListener('dragleave', handleDragLeave);
    dropZone?.addEventListener('drop', handleDrop);

    return () => {
      dropZone?.removeEventListener('dragover', handleDragOver);
      dropZone?.removeEventListener('dragleave', handleDragLeave);
      dropZone?.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <div>
      {/* <Seo {...seoConfig} /> */}
      <main className="tool-container">
        <div className="tool-header">
          <h1>Compress Images</h1>
          <p className="heading-desc">Drag and drop your images below to compress</p>
        </div>
        <div className='main-container-div' id="drop-zone">
          <div className='middle-container'>
            <div className="upload-section" >
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileInputChange}
                accept=".png,.webp,.gif,.jpeg,.jpg"
                hidden
              />
              <div
                className="upload-content"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <img src="/img/upload.svg" alt="Upload" className="upload-icon" width={50} height={50} />
                <h3>Drag & Drop Images</h3>
                <p>or click to browse files</p>
                <p className="support-text">Supports: PNG, WebP, GIF, JPEG</p>
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
                        width={100}
                        height={100}
                      />
                      <button
                        className="delete-btn"
                        onClick={() => deleteFile(index)}
                      >
                        <img src="/img/delete-btn.svg" alt="Delete" width={20} height={20} />
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
              <div>
                <h3 className='right-options-heading'>Actions</h3>
                <div className="action-bar">
                  {!isProcessed ? (
                    <button
                      className="btn-4"
                      onClick={processImages}
                      disabled={isProcessing || files.length === 0}
                    >
                      {isProcessing ? 'Compressing...' : 'Compress Images'}
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn-4"
                        onClick={downloadProcessedFiles}
                      >
                        Download
                      </button>
                      <button
                        className="btn-2"
                        onClick={resetState}
                        style={{ marginLeft: '10px' }}
                      >
                        Reset
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>

            <div className="compression-options">
              <div>
                <h3 className='right-options-heading'>Lossless Compression</h3>
                <div className="checkbox-container">
                  <label>
                    <input
                      type="checkbox"
                      checked={isLossless}
                      onChange={() => setIsLossless(!isLossless)}
                    />
                    Enable
                  </label>
                </div>
              </div>
            </div>
            {!isLossless && (
              <div>
                <><h3 className='right-options-heading'>Quality</h3><div className="quality-slider">
                  <input
                    type="range"
                    id="quality-range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    disabled={isLossless} />
                  <div className='quality-range-text'>
                    {quality}%
                  </div>
                </div></>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>

  );
}

export default CompressImages;