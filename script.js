
    /**
     * Huffman Coding implementation for message compression
     */
    class HuffmanNode {
        constructor(char, freq) {
            this.char = char;
            this.freq = freq;
            this.left = null;
            this.right = null;
        }
    }

    class HuffmanCoding {
        constructor() {
            this.root = null;
            this.codes = {};
        }

        calculateFrequency(str) {
            const frequency = {};
            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                frequency[char] = (frequency[char] || 0) + 1;
            }
            return frequency;
        }

        buildHuffmanTree(str) {
            const frequency = this.calculateFrequency(str);
            const priorityQueue = [];
            
            for (const char in frequency) {
                priorityQueue.push(new HuffmanNode(char, frequency[char]));
            }
            
            priorityQueue.sort((a, b) => a.freq - b.freq);
            
            while (priorityQueue.length > 1) {
                const left = priorityQueue.shift();
                const right = priorityQueue.shift();
                
                const newNode = new HuffmanNode(null, left.freq + right.freq);
                newNode.left = left;
                newNode.right = right;
                
                priorityQueue.push(newNode);
                priorityQueue.sort((a, b) => a.freq - b.freq);
            }
            
            this.root = priorityQueue[0];
            this.generateCodes(this.root, "");
            
            return this.root;
        }
        
        generateCodes(node, code) {
            if (node === null) return;
            
            if (node.char !== null) {
                this.codes[node.char] = code;
            }
            
            this.generateCodes(node.left, code + "0");
            this.generateCodes(node.right, code + "1");
        }
        
        encode(str) {
            if (!this.root) {
                this.buildHuffmanTree(str);
            }
            
            let encodedString = "";
            for (let i = 0; i < str.length; i++) {
                encodedString += this.codes[str[i]];
            }
            
            return encodedString;
        }
        
        decode(encodedStr) {
            if (!this.root) return "";
            
            let current = this.root;
            let decodedString = "";
            
            for (let i = 0; i < encodedStr.length; i++) {
                current = encodedStr[i] === "0" ? current.left : current.right;
                
                if (current && current.char !== null) {
                    decodedString += current.char;
                    current = this.root;
                }
                
                if (!current) {
                    break;
                }
            }
            
            return decodedString;
        }

        getCodesTable() {
            return this.codes;
        }
        
        setCodesTable(codes) {
            this.codes = codes;
            this.reconstructTree();
        }
        
        reconstructTree() {
            this.root = new HuffmanNode(null, 0);
            
            for (const char in this.codes) {
                const code = this.codes[char];
                let current = this.root;
                
                for (let i = 0; i < code.length; i++) {
                    if (code[i] === "0") {
                        if (!current.left) {
                            current.left = new HuffmanNode(null, 0);
                        }
                        current = current.left;
                    } else {
                        if (!current.right) {
                            current.right = new HuffmanNode(null, 0);
                        }
                        current = current.right;
                    }
                    
                    if (i === code.length - 1) {
                        current.char = char;
                    }
                }
            }
        }
    }

    /**
     * Discrete Cosine Transform implementation for steganography
     */
    class DCT {
        constructor() {
            this.N = 8;
        }
       
        forwardDCT(data) {
            const N = this.N;
            const output = new Array(N).fill(0);
           
            for (let k = 0; k < N; k++) {
                let sum = 0;
                for (let n = 0; n < N; n++) {
                    sum += data[n] * Math.cos((Math.PI / N) * (n + 0.5) * k);
                }
                output[k] = sum * this.alpha(k);
            }
           
            return output;
        }
       
        inverseDCT(dctCoeffs) {
            const N = this.N;
            const output = new Array(N).fill(0);
           
            for (let n = 0; n < N; n++) {
                let sum = 0;
                for (let k = 0; k < N; k++) {
                    sum += this.alpha(k) * dctCoeffs[k] * Math.cos((Math.PI / N) * (n + 0.5) * k);
                }
                output[n] = sum;
            }
           
            return output;
        }
       
        alpha(k) {
            if (k === 0) {
                return 1 / Math.sqrt(this.N);
            } else {
                return Math.sqrt(2 / this.N);
            }
        }
       
        applyDCT(data) {
            const result = [];
           
            if (!data || data.length === 0) {
                return [0, 0, 0, 0, 0, 0, 0, 0];
            }
           
            for (let i = 0; i < data.length; i += this.N) {
                const block = data.slice(i, i + this.N);
               
                while (block.length < this.N) {
                    block.push(0);
                }
               
                const dctBlock = this.forwardDCT(block);
                result.push(...dctBlock);
            }
           
            return result;
        }
       
        applyInverseDCT(dctData) {
            const result = [];
           
            for (let i = 0; i < dctData.length; i += this.N) {
                const block = dctData.slice(i, i + this.N);
                const idctBlock = this.inverseDCT(block);
                result.push(...idctBlock);
            }
           
            return result;
        }
    }

    /**
     * Steganography implementation for hiding messages in emojis
     */
    class EmojiSteganography {
        constructor() {
            this.huffman = new HuffmanCoding();
            this.dct = new DCT();
        }
        
        embedMessage(message, baseEmoji) {
            const END_MARKER = "###END###";
            const messageWithMarker = message + END_MARKER;
            
            const huffmanTree = this.huffman.buildHuffmanTree(messageWithMarker);
            const compressedMessage = this.huffman.encode(messageWithMarker);
            
            const binaryData = this.binaryStringToData(compressedMessage);
            const dctData = this.dct.applyDCT(binaryData);
            const encodedEmoji = this.embedDataInEmoji(baseEmoji, dctData, this.huffman.getCodesTable());
            
            return encodedEmoji;
        }
        
        extractMessage(encodedEmoji) {
            try {
                const { extractedData, codesTable } = this.extractDataFromEmoji(encodedEmoji);
                const inverseDctData = this.dct.applyInverseDCT(extractedData);
                const binaryString = this.dataToBinaryString(inverseDctData);
                
                this.huffman.setCodesTable(codesTable);
                const decodedMessage = this.huffman.decode(binaryString);

                const END_MARKER = "###END###";
                const markerIndex = decodedMessage.indexOf(END_MARKER);
                if (markerIndex !== -1) {
                    return decodedMessage.substring(0, markerIndex);
                }
                
                return decodedMessage;
            } catch (error) {
                console.error("Error extracting message:", error);
                return "Gagal mengekstrak pesan. Emoji ini mungkin tidak berisi pesan tersembunyi atau sudah rusak.";
            }
        }
        
        binaryStringToData(binaryString) {
            const data = [];
            
            if (!binaryString || binaryString.length === 0) {
                return [0];
            }
            
            for (let i = 0; i < binaryString.length; i += 8) {
                const chunk = binaryString.substr(i, 8).padEnd(8, '0');
                const value = parseInt(chunk, 2);
                data.push(value);
            }
            
            return data;
        }

        dataToBinaryString(data) {
            let binaryString = "";
            for (let i = 0; i < data.length; i++) {
                const value = Math.round(data[i]);
                const binary = value.toString(2).padStart(8, '0');
                binaryString += binary;
            }
            return binaryString;
        }
        
        embedDataInEmoji(baseEmoji, data, codesTable) {
            const emojiCodePoint = baseEmoji.codePointAt(0);
            
            const serializedData = {
                data: data,
                codesTable: codesTable,
                originalEmoji: emojiCodePoint
            };
            
            const jsonData = JSON.stringify(serializedData);
            const base64Data = btoa(jsonData);
            
            let encryptedData = '';
            for (let i = 0; i < base64Data.length; i++) {
                const charCode = base64Data.charCodeAt(i) + 1;
                encryptedData += String.fromCharCode(charCode);
            }
            
            let hiddenData = '';
            for (let i = 0; i < encryptedData.length; i++) {
                const char = encryptedData.charAt(i);
                const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
                
                for (let j = 0; j < binary.length; j++) {
                    hiddenData += binary.charAt(j) === '0' ? '\uFE0E' : '\uFE0F';
                }
            }
            
            const marker = '\u200C\u200D\u200C\u200D';
            
            return baseEmoji + marker + hiddenData;
        }

        extractDataFromEmoji(encodedEmoji) {
            const marker = '\u200C\u200D\u200C\u200D';
            if (!encodedEmoji.includes(marker)) {
                throw new Error("Emoji ini tidak berisi data tersembunyi");
            }
            
            const parts = encodedEmoji.split(marker);
            if (parts.length < 2) {
                throw new Error("Format emoji yang dienkode tidak valid");
            }
            
            const baseEmoji = parts[0];
            const hiddenData = parts[1];
            
            let binaryString = '';
            for (let i = 0; i < hiddenData.length; i++) {
                const char = hiddenData.charAt(i);
                if (char === '\uFE0E') {
                    binaryString += '0';
                } else if (char === '\uFE0F') {
                    binaryString += '1';
                }
            }
            
            let encryptedData = '';
            for (let i = 0; i < binaryString.length; i += 8) {
                const byte = binaryString.substr(i, 8);
                if (byte.length === 8) {
                    const charCode = parseInt(byte, 2);
                    encryptedData += String.fromCharCode(charCode);
                }
            }
            
            let base64Data = '';
            for (let i = 0; i < encryptedData.length; i++) {
                const charCode = encryptedData.charCodeAt(i) - 1;
                base64Data += String.fromCharCode(charCode);
            }
            
            try {
                const jsonData = atob(base64Data);
                const serializedData = JSON.parse(jsonData);
                
                return {
                    extractedData: serializedData.data,
                    codesTable: serializedData.codesTable,
                    originalEmoji: String.fromCodePoint(serializedData.originalEmoji)
                };
            } catch (error) {
                throw new Error("Gagal mendekode data tersembunyi: " + error.message);
            }
        }
    }

    /**
     * Image Steganography using LSB method
     */
    class ImageSteganography {
        constructor() {
            this.quality = 80;
        }

        setQuality(quality) {
            this.quality = Math.max(10, Math.min(95, quality));
        }

        async embedEmojiIntoImage(imageFile, emojiData) {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    try {
                        // Get image data
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        
                        // Convert emoji data to UTF-8 bytes
                        const emojiBytes = new TextEncoder().encode(emojiData);
                        console.log('Menyembunyikan emoji bytes:', emojiBytes.length, 'bytes');
                        
                        // Check if we have enough space
                        const maxCapacity = Math.floor((data.length / 4) - 32); // -32 for length header
                        if (emojiBytes.length > maxCapacity) {
                            throw new Error(`Gambar terlalu kecil. Butuh ${emojiBytes.length} bytes, tapi hanya ${maxCapacity} tersedia.`);
                        }
                        
                        // Embed length first (32 bits) - embed in Red channel only
                        const lengthBinary = emojiBytes.length.toString(2).padStart(32, '0');
                        console.log('Menyembunyikan panjang:', emojiBytes.length, 'sebagai binary:', lengthBinary);
                        
                        for (let i = 0; i < 32; i++) {
                            const pixelIndex = i * 4; // Red channel of each pixel
                            const bit = parseInt(lengthBinary[i]);
                            data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit;
                        }
                        
                        // Embed actual data - each byte in 8 consecutive red channels
                        let bitIndex = 0;
                        for (let byteIndex = 0; byteIndex < emojiBytes.length; byteIndex++) {
                            const byte = emojiBytes[byteIndex];
                            const byteBinary = byte.toString(2).padStart(8, '0');
                            
                            for (let bitPos = 0; bitPos < 8; bitPos++) {
                                const pixelIndex = (32 + bitIndex) * 4; // Start after length header
                                const bit = parseInt(byteBinary[bitPos]);
                                
                                if (pixelIndex < data.length) {
                                    data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit;
                                }
                                bitIndex++;
                            }
                        }
                        
                        console.log('Total bits disembunyikan:', 32 + (emojiBytes.length * 8));
                        
                        // Put modified data back
                        ctx.putImageData(imageData, 0, 0);
                        
                        // Convert to blob
                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }, 'image/png', this.quality / 100);
                        
                    } catch (error) {
                        reject(error);
                    }
                };
                
                img.onerror = () => reject(new Error('Gagal memuat gambar'));
                img.src = URL.createObjectURL(imageFile);
            });
        }
        
        async extractEmojiFromImage(imageFile) {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    try {
                        // Get image data
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        
                        // Extract length first (32 bits) - from Red channel only
                        let lengthBinary = '';
                        for (let i = 0; i < 32; i++) {
                            const pixelIndex = i * 4; // Red channel of each pixel
                            lengthBinary += (data[pixelIndex] & 1).toString();
                        }
                        
                        const dataLength = parseInt(lengthBinary, 2);
                        console.log('Panjang data diekstrak:', dataLength, 'bytes');
                        
                        if (dataLength <= 0 || dataLength > 50000) { // More reasonable limit
                            throw new Error(`Panjang data tidak valid: ${dataLength}. Tidak ada data tersembunyi atau data rusak.`);
                        }
                        
                        // Extract actual data - each byte from 8 consecutive red channels
                        const extractedBytes = [];
                        let bitIndex = 0;
                        
                        for (let byteIndex = 0; byteIndex < dataLength; byteIndex++) {
                            let byteBinary = '';
                            
                            for (let bitPos = 0; bitPos < 8; bitPos++) {
                                const pixelIndex = (32 + bitIndex) * 4; // Start after length header
                                
                                if (pixelIndex < data.length) {
                                    byteBinary += (data[pixelIndex] & 1).toString();
                                } else {
                                    throw new Error('Ekstraksi data tidak lengkap - gambar terlalu kecil');
                                }
                                bitIndex++;
                            }
                            
                            const byteValue = parseInt(byteBinary, 2);
                            extractedBytes.push(byteValue);
                        }
                        
                        console.log('Bytes diekstrak:', extractedBytes.length);
                        
                        // Convert bytes back to string (emoji data)
                        const emojiData = new TextDecoder().decode(new Uint8Array(extractedBytes));
                        console.log('Data emoji diekstrak:', emojiData.substring(0, 100) + '...');
                        
                        // Basic validation - check if it looks like emoji data
                        if (!emojiData || emojiData.length < 5) {
                            throw new Error('Data yang diekstrak tampak tidak valid atau rusak');
                        }
                        
                        resolve(emojiData);
                        
                    } catch (error) {
                        console.error('Error ekstraksi:', error);
                        reject(error);
                    }
                };
                
                img.onerror = () => reject(new Error('Gagal memuat gambar'));
                img.src = URL.createObjectURL(imageFile);
            });
        }
    }

    /**
     * Main JavaScript file for the Enhanced Emoji Steganography website
     */
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize engines
        const steganography = new EmojiSteganography();
        const imageSteganography = new ImageSteganography();

        
        
        // DOM elements - existing
        const messageInput = document.getElementById('message');
        const embedBtn = document.getElementById('embedBtn');
        const embedResult = document.getElementById('embedResult');
        const copyBtn = document.getElementById('copyBtn');
        const copySection = document.getElementById('copySection');
        const encodedEmojiInput = document.getElementById('encodedEmoji');
        const extractBtn = document.getElementById('extractBtn');
        const extractResult = document.getElementById('extractResult');
        const emojiButtons = document.querySelectorAll('.emoji-btn');
        
        // DOM elements - new for image functionality
        const emojiWithMessageInput = document.getElementById('emojiWithMessageInput');
        const imageFileInput = document.getElementById('imageFileInput');
        const imageUploadContainer = document.getElementById('imageUploadContainer');
        const uploadPrompt = document.getElementById('uploadPrompt');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        const embedToImageBtn = document.getElementById('embedToImageBtn');
        const imageEmbedResult = document.getElementById('imageEmbedResult');
        const imageDownloadSection = document.getElementById('imageDownloadSection');
        const downloadImageBtn = document.getElementById('downloadImageBtn');
        
        // DOM elements - for extraction functionality
        const extractImageFileInput = document.getElementById('extractImageFileInput');
        const extractImageUploadContainer = document.getElementById('extractImageUploadContainer');
        const extractUploadPrompt = document.getElementById('extractUploadPrompt');
        const extractImagePreview = document.getElementById('extractImagePreview');
        const extractPreviewImg = document.getElementById('extractPreviewImg');
        const extractFromImageBtn = document.getElementById('extractFromImageBtn');
        const imageExtractResult = document.getElementById('imageExtractResult');
        const extractedEmojiSection = document.getElementById('extractedEmojiSection');
        const copyExtractedEmojiBtn = document.getElementById('copyExtractedEmojiBtn');

        // Fix for tab initialization issues
const imageStegTabs = document.getElementById('imageStegTabs');
if (imageStegTabs) {
    // Ensure extract pane is hidden initially
    const extractPane = document.getElementById('extract-pane');
    if (extractPane) {
        extractPane.classList.remove('show', 'active');
    }
    
    // Ensure embed pane is shown initially
    const embedPane = document.getElementById('embed-pane');
    if (embedPane) {
        embedPane.classList.add('show', 'active');
    }
    
    // Properly initialize the tabs
    const tabEls = document.querySelectorAll('#imageStegTabs button[data-bs-toggle="tab"]');
    tabEls.forEach(tabEl => {
        tabEl.addEventListener('click', function() {
            // When a tab is clicked, update aria-selected attributes
            tabEls.forEach(el => {
                el.setAttribute('aria-selected', 'false');
                el.classList.remove('active');
            });
            this.setAttribute('aria-selected', 'true');
            this.classList.add('active');
            
            // Get the target pane
            const targetId = this.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetId);
            
            // Hide all panes
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Show the target pane
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
        });
    });
    
    // Force the embed tab to be active on page load
    const embedTab = document.getElementById('embed-tab');
    if (embedTab) {
        // Use setTimeout to ensure this runs after any other initialization
        setTimeout(() => {
            // Manually trigger the click event
            embedTab.click();
        }, 100);
    }
}

        
        // Current selected emoji and uploaded image
        let selectedEmoji = "😎";
        let uploadedImageFile = null;
        let extractUploadedImageFile = null;
        let resultImageBlob = null;
        let extractedEmojiData = null;
        
        // Handle emoji selection
        emojiButtons.forEach(button => {
            button.addEventListener('click', function() {
                emojiButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                selectedEmoji = this.getAttribute('data-emoji');
            });
        });
        
        // Handle embed button click
        if (embedBtn) {
            embedBtn.addEventListener('click', function() {
                const message = messageInput.value.trim();
                
                if (!message) {
                    showError(embedResult, "Silakan masukkan pesan yang ingin disembunyikan");
                    return;
                }
                
                if (message.length > 100) {
                    showError(embedResult, "Pesan terlalu panjang. Batasi hingga 100 karakter untuk hasil terbaik.");
                    return;
                }
                    
                try {
                    embedResult.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memproses...</span></div></div>';
                    
                    setTimeout(() => {
                        const encodedEmoji = steganography.embedMessage(message, selectedEmoji);
                        
                        embedResult.innerHTML = `
                            <div class="text-center">
                                <p class="mb-3"><strong>🎉 Pesan berhasil disembunyikan dalam emoji ini:</strong></p>
                                <div class="result-emoji pulse">${encodedEmoji}</div>
                                <p class="text-muted mt-3">Salin emoji ini dan bagikan dengan orang yang tahu cara mengekstrak pesannya.</p>
                            </div>
                        `;
                        
                        if (copySection) {
                            copySection.classList.remove('d-none');
                        }
                        updateShareLinks(encodedEmoji, message);
                    }, 500);
                } catch (error) {
                    showError(embedResult, "Error menyembunyikan pesan: " + error.message);
                }
            });
        }
        
        // Handle extract button click
        if (extractBtn) {
            extractBtn.addEventListener('click', function() {
                const encodedEmoji = encodedEmojiInput.value.trim();
                
                if (!encodedEmoji) {
                    showError(extractResult, "Silakan paste emoji yang berisi pesan tersembunyi");
                    return;
                }
                
                try {
                    extractResult.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Mengekstrak...</span></div></div>';
                    
                    setTimeout(() => {
                        const extractedMessage = steganography.extractMessage(encodedEmoji);
                        
                        extractResult.innerHTML = `
                            <div class="text-center">
                                <p class="mb-3"><strong>📜 Pesan berhasil diekstrak:</strong></p>
                                <div class="alert alert-success fs-5 fw-bold">
                                    "${extractedMessage}"
                                </div>
                            </div>
                        `;
                    }, 500);
                } catch (error) {
                    showError(extractResult, "Error mengekstrak pesan: " + error.message);
                }
            });
        }
        
        // Handle copy button click
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const emojiElement = embedResult.querySelector('.result-emoji');
                
                if (emojiElement) {
                    navigator.clipboard.writeText(emojiElement.textContent)
                        .then(() => {
                            copyBtn.innerHTML = "✅ Tersalin!";
                            copyBtn.classList.remove('btn-success');
                            copyBtn.classList.add('btn-primary');
                            
                            setTimeout(() => {
                                copyBtn.innerHTML = "📋 Salin ke Clipboard";
                                copyBtn.classList.remove('btn-primary');
                                copyBtn.classList.add('btn-success');
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy: ', err);
                            copyBtn.innerHTML = "❌ Gagal salin";
                        });
                }
            });
        }

        // Handle image upload for embedding
        if (imageUploadContainer) {
            imageUploadContainer.addEventListener('click', () => {
                if (imageFileInput) {
                    imageFileInput.click();
                }
            });
        }

        if (imageFileInput) {
            imageFileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) { // 5MB limit
                        alert('Ukuran file harus kurang dari 5MB');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (previewImg) {
                            previewImg.src = e.target.result;
                        }
                        if (uploadPrompt) {
                            uploadPrompt.classList.add('d-none');
                        }
                        if (imagePreview) {
                            imagePreview.classList.remove('d-none');
                        }
                        uploadedImageFile = file;
                        checkEmbedToImageReady();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Handle image upload for extraction
        if (extractImageUploadContainer) {
            extractImageUploadContainer.addEventListener('click', () => {
                if (extractImageFileInput) {
                    extractImageFileInput.click();
                }
            });
        }

        if (extractImageFileInput) {
            extractImageFileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 5 * 1024 * 1024) { // 5MB limit
                        alert('Ukuran file harus kurang dari 5MB');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (extractPreviewImg) {
                            extractPreviewImg.src = e.target.result;
                        }
                        if (extractUploadPrompt) {
                            extractUploadPrompt.classList.add('d-none');
                        }
                        if (extractImagePreview) {
                            extractImagePreview.classList.remove('d-none');
                        }
                        extractUploadedImageFile = file;
                        if (extractFromImageBtn) {
                            extractFromImageBtn.disabled = false;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Handle quality slider
        if (qualitySlider) {
            qualitySlider.addEventListener('input', function() {
                if (qualityValue) {
                    qualityValue.textContent = this.value;
                }
                imageSteganography.setQuality(parseInt(this.value));
            });
        }

        // Handle emoji with message input
        if (emojiWithMessageInput) {
            emojiWithMessageInput.addEventListener('input', checkEmbedToImageReady);
        }

        function checkEmbedToImageReady() {
            const hasEmoji = emojiWithMessageInput && emojiWithMessageInput.value.trim() !== '';
            const hasImage = uploadedImageFile !== null;
            if (embedToImageBtn) {
                embedToImageBtn.disabled = !(hasEmoji && hasImage);
            }
        }

        // Handle embed to image button
        if (embedToImageBtn) {
            embedToImageBtn.addEventListener('click', async function() {
                const emojiData = emojiWithMessageInput ? emojiWithMessageInput.value.trim() : '';
                
                if (!emojiData || !uploadedImageFile) {
                    alert('Silakan berikan emoji berisi pesan dan gambar');
                    return;
                }

                try {
                    embedToImageBtn.disabled = true;
                    embedToImageBtn.innerHTML = '🔄 Memproses...';
                    
                    if (imageEmbedResult) {
                        imageEmbedResult.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Menyembunyikan emoji...</span></div></div>';
                    }

                    // Embed emoji into image
                    resultImageBlob = await imageSteganography.embedEmojiIntoImage(uploadedImageFile, emojiData);
                    
                    // Create preview
                    const imageUrl = URL.createObjectURL(resultImageBlob);
                    
                    if (imageEmbedResult) {
                        imageEmbedResult.innerHTML = `
                            <div class="text-center">
                                <img src="${imageUrl}" class="preview-image" alt="Hasil Gambar">
                                <div class="alert alert-success mt-3">
                                    <h6>✅ Berhasil Disembunyikan!</h6>
                                    <small>Emoji berhasil disembunyikan dalam gambar</small>
                                </div>
                                <small class="text-muted">Pesan emoji sekarang tersembunyi dalam gambar ini!</small>
                            </div>
                        `;
                    }
                    
                    if (imageDownloadSection) {
                        imageDownloadSection.classList.remove('d-none');
                    }
                    
                } catch (error) {
                    console.error('Error embedding emoji into image:', error);
                    showError(imageEmbedResult, 'Error Penyembunyian: ' + error.message);
                } finally {
                    embedToImageBtn.disabled = false;
                    embedToImageBtn.innerHTML = '🔐 Sembunyikan Emoji ke Gambar';
                    checkEmbedToImageReady();
                }
            });
        }

        // Handle download button
        if (downloadImageBtn) {
            downloadImageBtn.addEventListener('click', function() {
                if (resultImageBlob) {
                    const url = URL.createObjectURL(resultImageBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'gambar-steganografi.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            });
        }

        // Handle extract from image button
        if (extractFromImageBtn) {
            extractFromImageBtn.addEventListener('click', async function() {
                if (!extractUploadedImageFile) {
                    alert('Silakan upload gambar terlebih dahulu');
                    return;
                }

                try {
                    extractFromImageBtn.disabled = true;
                    extractFromImageBtn.innerHTML = '🔄 Menganalisis...';
                    
                    if (imageExtractResult) {
                        imageExtractResult.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Mengekstrak emoji...</span></div></div>';
                    }

                    // Extract emoji from image
                    extractedEmojiData = await imageSteganography.extractEmojiFromImage(extractUploadedImageFile);
                    
                    // Display results
                    if (imageExtractResult) {
                        imageExtractResult.innerHTML = `
                            <div class="text-center">
                                <div class="alert alert-success">
                                    <h5>✅ Emoji Berhasil Diekstrak!</h5>
                                    <div class="result-emoji pulse">${extractedEmojiData}</div>
                                </div>
                                <p class="text-muted">Emoji ini berisi pesan tersembunyi. Gunakan bagian "Ekstrak Pesan" untuk mengungkapnya.</p>
                            </div>
                        `;
                    }
                    
                    if (extractedEmojiSection) {
                        extractedEmojiSection.classList.remove('d-none');
                    }
                    
                } catch (error) {
                    console.error('Error extracting emoji from image:', error);
                    showError(imageExtractResult, 'Error Ekstraksi: ' + error.message + ' Pastikan gambar ini dibuat dengan metode penyembunyian kami.');
                } finally {
                    extractFromImageBtn.disabled = false;
                    extractFromImageBtn.innerHTML = '🔍 Ekstrak Emoji dari Gambar';
                }
            });
        }

        // Handle copy extracted emoji button
        if (copyExtractedEmojiBtn) {
            copyExtractedEmojiBtn.addEventListener('click', function() {
                if (extractedEmojiData) {
                    navigator.clipboard.writeText(extractedEmojiData)
                        .then(() => {
                            copyExtractedEmojiBtn.innerHTML = "✅ Tersalin!";
                            copyExtractedEmojiBtn.classList.add('btn-success');
                            copyExtractedEmojiBtn.classList.remove('btn-primary');
                            
                            setTimeout(() => {
                                copyExtractedEmojiBtn.innerHTML = "📋 Salin Emoji";
                                copyExtractedEmojiBtn.classList.add('btn-primary');
                                copyExtractedEmojiBtn.classList.remove('btn-success');
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy: ', err);
                            copyExtractedEmojiBtn.textContent = "Gagal salin";
                        });
                }
            });
        }
        
        // Update share links
        function updateShareLinks(emoji, message) {
            const text = "Saya telah mengirimkan pesan rahasia yang tersembunyi dalam emoji ini. Ekstrak pesannya di EmoSteg!";
            
            if (whatsappShare) {
                whatsappShare.href = `https://wa.me/?text=${encodeURIComponent(text + ' ' + emoji)}`;
            }
            if (twitterShare) {
                twitterShare.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + emoji)}`;
            }
            if (emailShare) {
                emailShare.href = `mailto:?subject=Pesan Rahasia&body=${encodeURIComponent(text + ' ' + emoji)}`;
            }
        }
        
        // Show error message
        function showError(element, message) {
            if (element) {
                element.innerHTML = `
                    <div class="alert alert-danger">
                        <strong>❌ Error:</strong> ${message}
                    </div>
                `;
            }
        }
        
        // Show success message
        function showSuccess(element, message) {
            if (element) {
                element.innerHTML = `
                    <div class="alert alert-success">
                        <strong>✅ Berhasil:</strong> ${message}
                    </div>
                `;
            }
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 60,
                        behavior: 'smooth'
                    });
                    
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
        
        // Handle navbar active state on scroll
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                    currentSection = '#' + section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentSection) {
                    link.classList.add('active');
                }
            });
        });

        // Add some interactive effects
        document.querySelectorAll('.modern-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add typing effect for placeholder text
        function typeEffect(element, text, speed = 100) {
            if (!element) return;
            
            let i = 0;
            element.placeholder = '';
            
            function typeWriter() {
                if (i < text.length) {
                    element.placeholder += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                }
            }
            typeWriter();
        }

        // Initialize typing effects
        setTimeout(() => {
            if (messageInput) {
                typeEffect(messageInput, "Ketik pesan rahasia yang ingin disembunyikan...", 80);
            }
        }, 1000);

        setTimeout(() => {
            if (encodedEmojiInput) {
                typeEffect(encodedEmojiInput, "Paste emoji berisi pesan rahasia di sini...", 80);
            }
        }, 2000);

        // Debug: Check if all elements are found
        console.log('DOM Elements Check:');
        console.log('messageInput:', !!messageInput);
        console.log('embedBtn:', !!embedBtn);
        console.log('extractBtn:', !!extractBtn);
        console.log('copyBtn:', !!copyBtn);
        console.log('imageFileInput:', !!imageFileInput);
        console.log('extractImageFileInput:', !!extractImageFileInput);
        console.log('emojiButtons length:', emojiButtons.length);
    });