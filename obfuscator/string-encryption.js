// String Encryption Module for ZiaanVeil

class StringEncryptor {
    constructor() {
        this.methods = {
            xor: this.encryptXOR.bind(this),
            aes: this.encryptAESLike.bind(this),
            base64: this.encryptBase64XOR.bind(this),
            rotating: this.encryptRotatingKey.bind(this)
        };
    }
    
    // Encrypt strings in Lua code
    encrypt(code, settings) {
        if (!settings.stringEncryptionEnabled) return code;
        
        const method = this.methods[settings.stringEncryptionMethod] || this.methods.xor;
        const key = settings.stringEncryptionKey || 'ZiaanVeilSecureKey2023';
        
        // Find all string literals
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        let result = code;
        let matches = [];
        let match;
        
        // Collect all matches
        while ((match = stringRegex.exec(code)) !== null) {
            matches.push({
                string: match[0],
                start: match.index,
                end: match.index + match[0].length
            });
        }
        
        // Replace strings in reverse order to preserve positions
        for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i];
            const originalString = m.string;
            const stringContent = originalString.substring(1, originalString.length - 1);
            
            // Skip empty strings and very short strings
            if (stringContent.length < 2) continue;
            
            // Encrypt the string content
            const encrypted = method(stringContent, key);
            
            // Create decryption call
            const replacement = this.createDecryptionCall(encrypted, key, settings);
            
            // Replace in result
            result = result.substring(0, m.start) + replacement + result.substring(m.end);
        }
        
        // Add decryption function to the beginning
        const decryptionFunction = this.generateDecryptionFunction(settings);
        result = decryptionFunction + '\n\n' + result;
        
        return result;
    }
    
    // XOR encryption
    encryptXOR(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const keyChar = key.charCodeAt(i % key.length);
            const textChar = text.charCodeAt(i);
            result += String.fromCharCode(textChar ^ keyChar);
        }
        return result;
    }
    
    // AES-like encryption (simplified)
    encryptAESLike(text, key) {
        // Simplified encryption for demonstration
        let result = '';
        const keyHash = this.hashString(key);
        
        for (let i = 0; i < text.length; i++) {
            const textChar = text.charCodeAt(i);
            const keyIndex = (i * 7) % keyHash.length;
            const encryptedChar = (textChar + keyHash.charCodeAt(keyIndex)) % 256;
            result += String.fromCharCode(encryptedChar);
        }
        
        return result;
    }
    
    // Base64 + XOR encryption
    encryptBase64XOR(text, key) {
        // First XOR encrypt
        const xorEncrypted = this.encryptXOR(text, key);
        
        // Then encode as base64-like string
        const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        
        for (let i = 0; i < xorEncrypted.length; i += 3) {
            const chunk = xorEncrypted.substring(i, i + 3);
            const charCodes = chunk.split('').map(c => c.charCodeAt(0));
            
            // Convert 3 bytes to 4 base64 characters
            const b1 = charCodes[0] || 0;
            const b2 = charCodes[1] || 0;
            const b3 = charCodes[2] || 0;
            
            result += base64Chars.charAt(b1 >> 2);
            result += base64Chars.charAt(((b1 & 3) << 4) | (b2 >> 4));
            result += base64Chars.charAt(((b2 & 15) << 2) | (b3 >> 6));
            result += base64Chars.charAt(b3 & 63);
        }
        
        // Add padding if needed
        const padding = 4 - (result.length % 4);
        if (padding < 4) {
            result += '='.repeat(padding);
        }
        
        return result;
    }
    
    // Rotating key encryption
    encryptRotatingKey(text, key) {
        let result = '';
        let keyIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const textChar = text.charCodeAt(i);
            const keyChar = key.charCodeAt(keyIndex);
            
            // Rotate key index
            keyIndex = (keyIndex + 1) % key.length;
            
            // Encrypt with rotating operation
            const operation = i % 4;
            let encryptedChar;
            
            switch (operation) {
                case 0: encryptedChar = textChar ^ keyChar; break;
                case 1: encryptedChar = (textChar + keyChar) % 256; break;
                case 2: encryptedChar = (textChar - keyChar + 256) % 256; break;
                case 3: encryptedChar = (textChar * (keyChar % 16)) % 256; break;
            }
            
            result += String.fromCharCode(encryptedChar);
        }
        
        return result;
    }
    
    // Create string hash for key generation
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }
    
    // Create decryption call for encrypted string
    createDecryptionCall(encryptedString, key, settings) {
        const method = settings.stringEncryptionMethod;
        
        // Split string if enabled
        if (settings.stringSplitEnabled && encryptedString.length > 10) {
            const mid = Math.floor(encryptedString.length / 2);
            const part1 = encryptedString.substring(0, mid);
            const part2 = encryptedString.substring(mid);
            
            return `ZV_Decrypt("${this.escapeString(part1)}" .. "${this.escapeString(part2)}", "${key}")`;
        }
        
        return `ZV_Decrypt("${this.escapeString(encryptedString)}", "${key}")`;
    }
    
    // Escape string for Lua
    escapeString(str) {
        return str
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    }
    
    // Generate decryption function based on method
    generateDecryptionFunction(settings) {
        const method = settings.stringEncryptionMethod;
        let functionBody = '';
        
        switch (method) {
            case 'xor':
                functionBody = this.generateXORDecryption();
                break;
            case 'aes':
                functionBody = this.generateAESLikeDecryption();
                break;
            case 'base64':
                functionBody = this.generateBase64XORDecryption();
                break;
            case 'rotating':
                functionBody = this.generateRotatingKeyDecryption();
                break;
            default:
                functionBody = this.generateXORDecryption();
        }
        
        return functionBody;
    }
    
    // Generate XOR decryption function
    generateXORDecryption() {
        return `local function ZV_Decrypt(str, key)
    local result = ""
    for i = 1, #str do
        local keyChar = string.byte(key, (i - 1) % #key + 1)
        local strChar = string.byte(str, i)
        result = result .. string.char(bit32.bxor(strChar, keyChar))
    end
    return result
end`;
    }
    
    // Generate AES-like decryption function
    generateAESLikeDecryption() {
        return `local function ZV_Decrypt(str, key)
    local result = ""
    local keyHash = "${this.hashString('ZiaanVeilSecureKey2023')}"
    for i = 1, #str do
        local strChar = string.byte(str, i)
        local keyIndex = ((i - 1) * 7) % #keyHash + 1
        local keyChar = string.byte(keyHash, keyIndex)
        result = result .. string.char((strChar - keyChar + 256) % 256)
    end
    return result
end`;
    }
    
    // Generate Base64 + XOR decryption function
    generateBase64XORDecryption() {
        return `local function ZV_Decrypt(str, key)
    -- Base64 decode
    local b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    local b64 = {}
    for i = 1, #b64chars do
        b64[string.sub(b64chars, i, i)] = i - 1
    end
    
    -- Remove padding
    str = string.gsub(str, "=", "")
    
    -- Decode base64
    local decoded = ""
    for i = 1, #str, 4 do
        local chunk = string.sub(str, i, i + 3)
        local b1 = b64[string.sub(chunk, 1, 1)] or 0
        local b2 = b64[string.sub(chunk, 2, 2)] or 0
        local b3 = b64[string.sub(chunk, 3, 3)] or 0
        local b4 = b64[string.sub(chunk, 4, 4)] or 0
        
        local byte1 = bit32.bor(bit32.lshift(b1, 2), bit32.rshift(b2, 4))
        local byte2 = bit32.bor(bit32.lshift(bit32.band(b2, 15), 4), bit32.rshift(b3, 2))
        local byte3 = bit32.bor(bit32.lshift(bit32.band(b3, 3), 6), b4)
        
        decoded = decoded .. string.char(byte1)
        if #chunk > 2 then decoded = decoded .. string.char(byte2) end
        if #chunk > 3 then decoded = decoded .. string.char(byte3) end
    end
    
    -- XOR decrypt
    local result = ""
    for i = 1, #decoded do
        local keyChar = string.byte(key, (i - 1) % #key + 1)
        local strChar = string.byte(decoded, i)
        result = result .. string.char(bit32.bxor(strChar, keyChar))
    end
    
    return result
end`;
    }
    
    // Generate rotating key decryption function
    generateRotatingKeyDecryption() {
        return `local function ZV_Decrypt(str, key)
    local result = ""
    local keyIndex = 1
    
    for i = 1, #str do
        local strChar = string.byte(str, i)
        local keyChar = string.byte(key, keyIndex)
        local operation = (i - 1) % 4
        
        keyIndex = keyIndex + 1
        if keyIndex > #key then keyIndex = 1 end
        
        local decryptedChar
        if operation == 0 then
            decryptedChar = bit32.bxor(strChar, keyChar)
        elseif operation == 1 then
            decryptedChar = (strChar - keyChar + 256) % 256
        elseif operation == 2 then
            decryptedChar = (strChar + keyChar) % 256
        elseif operation == 3 then
            local divisor = keyChar % 16
            if divisor == 0 then divisor = 1 end
            decryptedChar = math.floor(strChar / divisor)
        end
        
        result = result .. string.char(decryptedChar)
    end
    
    return result
end`;
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.StringEncryptor = StringEncryptor;
}
