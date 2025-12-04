class StringEncryptor {
    constructor() {
        this.methods = {
            xor: this.xorMethod.bind(this),
            aes: this.aesMethod.bind(this),
            custom: this.customMethod.bind(this)
        };
    }

    encryptString(str, method = 'xor', obfuscateChars = true) {
        if (!str || str.length === 0) return str;
        
        const encryptor = this.methods[method] || this.methods.xor;
        let encrypted = encryptor(str);
        
        if (obfuscateChars) {
            encrypted = this.obfuscateCharacters(encrypted);
        }
        
        return encrypted;
    }

    xorMethod(str) {
        const key = ZiaanUtils.randomString(16);
        const xorEncrypted = ZiaanUtils.xorEncrypt(str, key);
        const base64Encoded = ZiaanUtils.base64Encode(xorEncrypted);
        
        return {
            encrypted: base64Encoded,
            decryptionCode: `(function(){local k="${key}";local e="${base64Encoded}";local d=loadstring("return '"..e.."'")().gsub('.', function(c) return string.char(c:byte() ~ k:byte()) end);return d;end)()`
        };
    }

    aesMethod(str) {
        // Simulated AES-like encryption
        const key = ZiaanUtils.randomString(32);
        const iv = ZiaanUtils.randomString(16);
        
        // Simple substitution cipher for simulation
        let encrypted = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            const ivChar = iv.charCodeAt(i % iv.length);
            encrypted += String.fromCharCode((charCode + keyChar + ivChar) % 256);
        }
        
        const base64Encoded = ZiaanUtils.base64Encode(encrypted);
        
        return {
            encrypted: base64Encoded,
            decryptionCode: `(function(){local k="${key}";local i="${iv}";local e="${base64Encoded}";local d=loadstring("return '"..e.."'")();local r="";for idx=1,#d do local bc=d:byte(idx);local kc=k:byte((idx-1)%#k+1);local ic=i:byte((idx-1)%#i+1);r=r..string.char((bc - kc - ic + 512)%256);end;return r;end)()`
        };
    }

    customMethod(str) {
        // Custom multi-layer encryption
        const key1 = ZiaanUtils.randomString(8);
        const key2 = ZiaanUtils.randomString(12);
        
        // Layer 1: XOR with key1
        let layer1 = '';
        for (let i = 0; i < str.length; i++) {
            layer1 += String.fromCharCode(str.charCodeAt(i) ^ key1.charCodeAt(i % key1.length));
        }
        
        // Layer 2: Reverse and add key2
        let layer2 = layer1.split('').reverse().join('');
        let layer3 = '';
        for (let i = 0; i < layer2.length; i++) {
            layer3 += String.fromCharCode(layer2.charCodeAt(i) + key2.charCodeAt(i % key2.length));
        }
        
        const base64Encoded = ZiaanUtils.base64Encode(layer3);
        
        return {
            encrypted: base64Encoded,
            decryptionCode: `(function(){local k1="${key1}";local k2="${key2}";local e="${base64Encoded}";local d=loadstring("return '"..e.."'")();local l3="";for i=1,#d do l3=l3..string.char(d:byte(i)-k2:byte((i-1)%#k2+1));end;local l2=l3:reverse();local l1="";for i=1,#l2 do l1=l1..string.char(l2:byte(i)~k1:byte((i-1)%#k1+1));end;return l1;end)()`
        };
    }

    obfuscateCharacters(str) {
        // Convert string to character code array and obfuscate
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (Math.random() > 0.7) {
                // Replace with escape sequence
                result += '\\' + str.charCodeAt(i).toString(8);
            } else if (Math.random() > 0.5) {
                // Use hex escape
                result += '\\x' + str.charCodeAt(i).toString(16).padStart(2, '0');
            } else {
                result += char;
            }
        }
        return result;
    }

    generateDecryptionFunction(encryptedData, method) {
        switch(method) {
            case 'xor':
                return `local function _decrypt_xor(s,k)local r="";for i=1,#s do r=r..string.char(s:byte(i)~k:byte((i-1)%#k+1));end;return r;end`;
            case 'aes':
                return `local function _decrypt_aes(s,k,i)local r="";for idx=1,#s do local bc=s:byte(idx);local kc=k:byte((idx-1)%#k+1);local ic=i:byte((idx-1)%#i+1);r=r..string.char((bc - kc - ic + 512)%256);end;return r;end`;
            case 'custom':
                return `local function _decrypt_custom(s,k1,k2)local l3="";for i=1,#s do l3=l3..string.char(s:byte(i)-k2:byte((i-1)%#k2+1));end;local l2=l3:reverse();local l1="";for i=1,#l2 do l1=l1..string.char(l2:byte(i)~k1:byte((i-1)%#k1+1));end;return l1;end`;
            default:
                return '';
        }
    }
}
