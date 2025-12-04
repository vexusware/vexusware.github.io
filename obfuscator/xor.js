// XOR Encryption Module for ZiaanVeil

class XOREncryptor {
    constructor() {
        this.defaultKey = "ZiaanVeilSecureKey";
        this.methods = {
            simple: this.simpleXOR.bind(this),
            rotating: this.rotatingXOR.bind(this),
            multiKey: this.multiKeyXOR.bind(this),
            cascading: this.cascadingXOR.bind(this)
        };
    }
    
    // Apply XOR encryption to the entire code
    encryptCode(code, settings) {
        if (!settings.xorEnabled) return code;
        
        const method = settings.xorMethod || 'rotating';
        const key = settings.stringEncryptionKey || this.defaultKey;
        const iterations = settings.xorIterations || 3;
        
        let encrypted = code;
        
        // Apply multiple iterations for stronger encryption
        for (let i = 0; i < iterations; i++) {
            const currentKey = this.generateIterationKey(key, i);
            encrypted = this.methods[method](encrypted, currentKey);
        }
        
        // Convert to encoded format
        const encoded = this.encodeForLua(encrypted);
        
        // Generate loader
        return this.generateLoader(encoded, key, method, iterations, settings);
    }
    
    // Apply XOR encryption to strings only
    encryptStrings(code, settings) {
        if (!settings.stringEncryptionEnabled) return code;
        
        const method = settings.stringEncryptionMethod || 'rotating';
        const key = settings.stringEncryptionKey || this.defaultKey;
        
        // Find and encrypt all string literals
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        let result = code;
        let matches = [];
        let match;
        
        // Collect all string matches
        while ((match = stringRegex.exec(code)) !== null) {
            matches.push({
                string: match[0],
                start: match.index,
                end: match.index + match[0].length
            });
        }
        
        // Process matches in reverse order to preserve positions
        for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i];
            const original = m.string;
            const content = original.substring(1, original.length - 1);
            
            // Skip very short strings
            if (content.length < 2) continue;
            
            // Encrypt the string
            const encrypted = this.encryptString(content, key, method);
            const replacement = this.createEncryptedStringCall(encrypted, key, method);
            
            // Replace in result
            result = result.substring(0, m.start) + replacement + result.substring(m.end);
        }
        
        // Add decryption function
        const decryptionFunc = this.generateStringDecryptionFunction(method);
        result = decryptionFunc + '\n\n' + result;
        
        return result;
    }
    
    // Simple XOR encryption
    simpleXOR(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const keyChar = key.charCodeAt(i % key.length);
            const textChar = text.charCodeAt(i);
            result += String.fromCharCode(textChar ^ keyChar);
        }
        return result;
    }
    
    // Rotating XOR with changing operation
    rotatingXOR(text, key) {
        let result = '';
        let keyIndex = 0;
        let operation = 0;
        
        for (let i = 0; i < text.length; i++) {
            const textChar = text.charCodeAt(i);
            const keyChar = key.charCodeAt(keyIndex);
            
            // Rotate through different operations
            let encryptedChar;
            switch (operation) {
                case 0: // XOR
                    encryptedChar = textChar ^ keyChar;
                    break;
                case 1: // Add
                    encryptedChar = (textChar + keyChar) % 256;
                    break;
                case 2: // Subtract
                    encryptedChar = (textChar - keyChar + 256) % 256;
                    break;
                case 3: // XOR with complement
                    encryptedChar = textChar ^ (~keyChar & 0xFF);
                    break;
            }
            
            result += String.fromCharCode(encryptedChar);
            
            // Update indices
            keyIndex = (keyIndex + 1) % key.length;
            operation = (operation + 1) % 4;
        }
        
        return result;
    }
    
    // Multi-key XOR (uses multiple keys)
    multiKeyXOR(text, key) {
        // Generate multiple keys from the base key
        const keys = this.generateKeysFromKey(key, 3);
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const textChar = text.charCodeAt(i);
            let encryptedChar = textChar;
            
            // Apply each key in sequence
            for (const k of keys) {
                const keyChar = k.charCodeAt(i % k.length);
                encryptedChar = encryptedChar ^ keyChar;
            }
            
            result += String.fromCharCode(encryptedChar);
        }
        
        return result;
    }
    
    // Cascading XOR (each byte depends on previous)
    cascadingXOR(text, key) {
        let result = '';
        let previous = 0;
        
        for (let i = 0; i < text.length; i++) {
            const textChar = text.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            
            // XOR with key and previous encrypted byte
            const encryptedChar = textChar ^ keyChar ^ previous;
            result += String.fromCharCode(encryptedChar);
            
            // Update previous for next iteration
            previous = encryptedChar;
        }
        
        return result;
    }
    
    // Generate multiple keys from a base key
    generateKeysFromKey(baseKey, count) {
        const keys = [baseKey];
        
        for (let i = 1; i < count; i++) {
            // Create derived keys by transforming the base key
            let derivedKey = '';
            for (let j = 0; j < baseKey.length; j++) {
                const charCode = baseKey.charCodeAt(j);
                // Apply different transformations for each derived key
                switch (i) {
                    case 1:
                        derivedKey += String.fromCharCode((charCode + 13) % 256);
                        break;
                    case 2:
                        derivedKey += String.fromCharCode((charCode * 7) % 256);
                        break;
                    default:
                        derivedKey += String.fromCharCode(~charCode & 0xFF);
                }
            }
            keys.push(derivedKey);
        }
        
        return keys;
    }
    
    // Generate key for specific iteration
    generateIterationKey(baseKey, iteration) {
        let key = baseKey;
        
        // Transform key based on iteration number
        for (let i = 0; i < iteration; i++) {
            let transformed = '';
            for (let j = 0; j < key.length; j++) {
                const charCode = key.charCodeAt(j);
                // Different transformation for each iteration
                switch (i % 4) {
                    case 0:
                        transformed += String.fromCharCode((charCode + 17) % 256);
                        break;
                    case 1:
                        transformed += String.fromCharCode((charCode ^ 0x55) % 256);
                        break;
                    case 2:
                        transformed += String.fromCharCode((charCode * 3) % 256);
                        break;
                    case 3:
                        transformed += String.fromCharCode((~charCode) & 0xFF);
                        break;
                }
            }
            key = transformed;
        }
        
        return key;
    }
    
    // Encrypt a string with specified method
    encryptString(text, key, method) {
        const encryptor = this.methods[method] || this.methods.simple;
        return encryptor(text, key);
    }
    
    // Encode encrypted data for Lua string
    encodeForLua(data) {
        // Convert to hexadecimal representation
        let hex = '';
        for (let i = 0; i < data.length; i++) {
            hex += data.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return hex;
    }
    
    // Create Lua call for encrypted string
    createEncryptedStringCall(encryptedData, key, method) {
        const hexString = this.encodeForLua(encryptedData);
        
        // Split long strings if needed
        if (hexString.length > 100) {
            const chunks = this.chunkString(hexString, 50);
            const chunkVars = chunks.map((chunk, i) => `_zv_s${i}`);
            const concatExpr = chunkVars.join(' .. ');
            
            let code = `(function()\n`;
            chunks.forEach((chunk, i) => {
                code += `    local _zv_s${i} = "${chunk}"\n`;
            });
            code += `    return ZV_DecryptString(${concatExpr}, "${key}", "${method}")\n`;
            code += `end)()`;
            
            return code;
        }
        
        return `ZV_DecryptString("${hexString}", "${key}", "${method}")`;
    }
    
    // Split string into chunks
    chunkString(str, size) {
        const chunks = [];
        for (let i = 0; i < str.length; i += size) {
            chunks.push(str.substring(i, i + size));
        }
        return chunks;
    }
    
    // Generate string decryption function
    generateStringDecryptionFunction(method) {
        switch (method) {
            case 'simple':
                return this.generateSimpleDecryptionFunction();
            case 'rotating':
                return this.generateRotatingDecryptionFunction();
            case 'multiKey':
                return this.generateMultiKeyDecryptionFunction();
            case 'cascading':
                return this.generateCascadingDecryptionFunction();
            default:
                return this.generateSimpleDecryptionFunction();
        }
    }
    
    // Generate simple XOR decryption function
    generateSimpleDecryptionFunction() {
        return `local function ZV_DecryptString(hexStr, key, method)
    -- Convert hex string to bytes
    local bytes = {}
    for i = 1, #hexStr, 2 do
        local byteStr = string.sub(hexStr, i, i + 1)
        table.insert(bytes, tonumber(byteStr, 16))
    end
    
    -- Simple XOR decryption
    local result = ""
    for i = 1, #bytes do
        local keyByte = string.byte(key, (i - 1) % #key + 1)
        local decrypted = bit32.bxor(bytes[i], keyByte)
        result = result .. string.char(decrypted)
    end
    
    return result
end`;
    }
    
    // Generate rotating XOR decryption function
    generateRotatingDecryptionFunction() {
        return `local function ZV_DecryptString(hexStr, key, method)
    -- Convert hex string to bytes
    local bytes = {}
    for i = 1, #hexStr, 2 do
        local byteStr = string.sub(hexStr, i, i + 1)
        table.insert(bytes, tonumber(byteStr, 16))
    end
    
    -- Rotating XOR decryption
    local result = ""
    local keyIndex = 1
    local operation = 0
    
    for i = 1, #bytes do
        local encrypted = bytes[i]
        local keyByte = string.byte(key, keyIndex)
        local decrypted
        
        -- Reverse the encryption operation
        if operation == 0 then
            decrypted = bit32.bxor(encrypted, keyByte)
        elseif operation == 1 then
            decrypted = (encrypted - keyByte + 256) % 256
        elseif operation == 2 then
            decrypted = (encrypted + keyByte) % 256
        elseif operation == 3 then
            decrypted = bit32.bxor(encrypted, bit32.bnot(keyByte) % 256)
        end
        
        result = result .. string.char(decrypted)
        
        -- Update indices
        keyIndex = keyIndex + 1
        if keyIndex > #key then keyIndex = 1 end
        operation = (operation + 1) % 4
    end
    
    return result
end`;
    }
    
    // Generate multi-key XOR decryption function
    generateMultiKeyDecryptionFunction() {
        return `local function ZV_DecryptString(hexStr, key, method)
    -- Convert hex string to bytes
    local bytes = {}
    for i = 1, #hexStr, 2 do
        local byteStr = string.sub(hexStr, i, i + 1)
        table.insert(bytes, tonumber(byteStr, 16))
    end
    
    -- Generate multiple keys from base key
    local function generateKeys(baseKey)
        local keys = {baseKey}
        
        -- First derived key: ROT13
        local key1 = ""
        for j = 1, #baseKey do
            local charCode = string.byte(baseKey, j)
            key1 = key1 .. string.char((charCode + 13) % 256)
        end
        table.insert(keys, key1)
        
        -- Second derived key: multiply by 7
        local key2 = ""
        for j = 1, #baseKey do
            local charCode = string.byte(baseKey, j)
            key2 = key2 .. string.char((charCode * 7) % 256)
        end
        table.insert(keys, key2)
        
        return keys
    end
    
    local keys = generateKeys(key)
    
    -- Multi-key XOR decryption
    local result = ""
    for i = 1, #bytes do
        local encrypted = bytes[i]
        local decrypted = encrypted
        
        -- Apply each key in reverse order
        for k = #keys, 1, -1 do
            local keyByte = string.byte(keys[k], (i - 1) % #keys[k] + 1)
            decrypted = bit32.bxor(decrypted, keyByte)
        end
        
        result = result .. string.char(decrypted)
    end
    
    return result
end`;
    }
    
    // Generate cascading XOR decryption function
    generateCascadingDecryptionFunction() {
        return `local function ZV_DecryptString(hexStr, key, method)
    -- Convert hex string to bytes
    local bytes = {}
    for i = 1, #hexStr, 2 do
        local byteStr = string.sub(hexStr, i, i + 1)
        table.insert(bytes, tonumber(byteStr, 16))
    end
    
    -- Cascading XOR decryption
    local result = ""
    local previous = 0
    
    for i = 1, #bytes do
        local encrypted = bytes[i]
        local keyByte = string.byte(key, (i - 1) % #key + 1)
        
        -- Reverse the cascading operation
        local decrypted = bit32.bxor(encrypted, keyByte, previous)
        result = result .. string.char(decrypted)
        
        -- Update previous for next iteration
        previous = encrypted
    end
    
    return result
end`;
    }
    
    // Generate loader for encrypted code
    generateLoader(encodedCode, key, method, iterations, settings) {
        return `-- ZiaanVeil XOR Encrypted Code Loader
-- Encryption Method: ${method}
-- Iterations: ${iterations}
-- Key: [hidden]

local ZV_EncryptedCode = "${encodedCode}"
local ZV_Key = "${key}"
local ZV_Method = "${method}"
local ZV_Iterations = ${iterations}

-- Hex to bytes conversion
local function ZV_HexToBytes(hexStr)
    local bytes = {}
    for i = 1, #hexStr, 2 do
        local byteStr = string.sub(hexStr, i, i + 1)
        table.insert(bytes, tonumber(byteStr, 16))
    end
    return bytes
end

-- XOR decryption with multiple iterations
local function ZV_DecryptBytes(bytes, key, method, iterations)
    local decrypted = bytes
    
    for iter = iterations - 1, 0, -1 do
        local iterationKey = key
        
        -- Transform key for this iteration
        for t = 1, iter do
            local transformed = ""
            for j = 1, #iterationKey do
                local charCode = string.byte(iterationKey, j)
                local transformType = (t - 1) % 4
                
                if transformType == 0 then
                    transformed = transformed .. string.char((charCode + 17) % 256)
                elseif transformType == 1 then
                    transformed = transformed .. string.char(bit32.bxor(charCode, 0x55))
                elseif transformType == 2 then
                    transformed = transformed .. string.char((charCode * 3) % 256)
                elseif transformType == 3 then
                    transformed = transformed .. string.char(bit32.bnot(charCode) % 256)
                end
            end
            iterationKey = transformed
        end
        
        local temp = {}
        
        if method == "simple" then
            for i = 1, #decrypted do
                local keyByte = string.byte(iterationKey, (i - 1) % #iterationKey + 1)
                temp[i] = bit32.bxor(decrypted[i], keyByte)
            end
            
        elseif method == "rotating" then
            local keyIndex = 1
            local operation = 0
            
            for i = 1, #decrypted do
                local encrypted = decrypted[i]
                local keyByte = string.byte(iterationKey, keyIndex)
                local decryptedByte
                
                -- Reverse rotating operations
                local op = (operation + (iter - iter) * 4) % 4
                if op == 0 then
                    decryptedByte = bit32.bxor(encrypted, keyByte)
                elseif op == 1 then
                    decryptedByte = (encrypted - keyByte + 256) % 256
                elseif op == 2 then
                    decryptedByte = (encrypted + keyByte) % 256
                elseif op == 3 then
                    decryptedByte = bit32.bxor(encrypted, bit32.bnot(keyByte) % 256)
                end
                
                temp[i] = decryptedByte
                
                keyIndex = keyIndex + 1
                if keyIndex > #iterationKey then keyIndex = 1 end
                operation = (operation + 1) % 4
            end
            
        elseif method == "cascading" then
            local previous = 0
            for i = 1, #decrypted do
                local encrypted = decrypted[i]
                local keyByte = string.byte(iterationKey, (i - 1) % #iterationKey + 1)
                
                -- Reverse cascading
                local decryptedByte = bit32.bxor(encrypted, keyByte, previous)
                temp[i] = decryptedByte
                
                previous = encrypted
            end
        end
        
        decrypted = temp
    end
    
    -- Convert bytes back to string
    local result = ""
    for i = 1, #decrypted do
        result = result .. string.char(decrypted[i])
    end
    
    return result
end

-- Main decryption and execution
local ZV_Bytes = ZV_HexToBytes(ZV_EncryptedCode)
local ZV_Decrypted = ZV_DecryptBytes(ZV_Bytes, ZV_Key, ZV_Method, ZV_Iterations)

-- Execute the decrypted code
local success, err = pcall(loadstring(ZV_Decrypted))
if not success then
    error("Failed to execute decrypted code: " .. tostring(err))
end`;
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.XOREncryptor = XOREncryptor;
}
