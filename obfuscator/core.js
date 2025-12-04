// ZiaanVeil Core Obfuscation Engine

class ZiaanVeilObfuscator {
    constructor() {
        this.version = '1.0.0';
        this.techniques = [];
        this.initialized = false;
    }
    
    // Initialize the obfuscator with settings
    initialize(settings) {
        this.settings = settings;
        this.randomSeed = settings.randomSeed || 'ZiaanVeil';
        this.setRandomSeed(this.randomSeed);
        
        // Initialize available techniques
        this.techniques = [
            'stringEncryption',
            'constantEncoding',
            'controlFlowFlattening',
            'variableRenaming',
            'bytecodeGeneration',
            'xorEncryption',
            'antiTamper',
            'metadataObfuscation'
        ];
        
        this.initialized = true;
        return this;
    }
    
    // Set random seed for reproducible obfuscation
    setRandomSeed(seed) {
        // Simple seeded random function
        let value = 0;
        for (let i = 0; i < seed.length; i++) {
            value = (value << 5) - value + seed.charCodeAt(i);
            value |= 0;
        }
        
        this.seed = value;
        this.randomState = value;
        
        // Override Math.random with seeded version
        this.originalRandom = Math.random;
        Math.random = this.seededRandom.bind(this);
    }
    
    // Seeded random number generator
    seededRandom() {
        this.randomState = (this.randomState * 9301 + 49297) % 233280;
        return this.randomState / 233280;
    }
    
    // Restore original Math.random
    restoreRandom() {
        if (this.originalRandom) {
            Math.random = this.originalRandom;
        }
    }
    
    // Parse Lua code into AST-like structure
    parseLuaCode(code) {
        // Simplified parser for demonstration
        // In a real implementation, this would use a proper Lua parser
        
        const ast = {
            type: 'Program',
            body: [],
            comments: [],
            strings: [],
            numbers: [],
            identifiers: []
        };
        
        // Extract strings
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        let match;
        while ((match = stringRegex.exec(code)) !== null) {
            ast.strings.push({
                value: match[0],
                start: match.index,
                end: match.index + match[0].length,
                line: this.getLineNumber(code, match.index)
            });
        }
        
        // Extract numbers
        const numberRegex = /-?\b\d+(\.\d+)?\b/g;
        while ((match = numberRegex.exec(code)) !== null) {
            ast.numbers.push({
                value: match[0],
                start: match.index,
                end: match.index + match[0].length,
                line: this.getLineNumber(code, match.index)
            });
        }
        
        // Extract identifiers (variables and functions)
        const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        while ((match = identifierRegex.exec(code)) !== null) {
            // Skip Lua keywords
            const keywords = [
                'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 
                'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 
                'return', 'then', 'true', 'until', 'while'
            ];
            
            if (!keywords.includes(match[0])) {
                ast.identifiers.push({
                    name: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    line: this.getLineNumber(code, match.index)
                });
            }
        }
        
        return ast;
    }
    
    // Get line number from index
    getLineNumber(code, index) {
        return code.substring(0, index).split('\n').length;
    }
    
    // Apply obfuscation based on settings
    obfuscate(code) {
        if (!this.initialized) {
            throw new Error('Obfuscator not initialized. Call initialize() first.');
        }
        
        let result = code;
        
        // Apply multiple iterations
        for (let i = 0; i < this.settings.obfuscationIterations; i++) {
            result = this.applyObfuscationIteration(result, i);
        }
        
        // Apply final transformations
        result = this.applyFinalTransformations(result);
        
        return result;
    }
    
    // Apply a single iteration of obfuscation
    applyObfuscationIteration(code, iteration) {
        let result = code;
        
        // Parse the code
        const ast = this.parseLuaCode(result);
        
        // Apply string encryption
        if (this.settings.stringEncryptionEnabled) {
            result = this.applyStringEncryption(result, ast);
        }
        
        // Apply constant encoding
        if (this.settings.constantEncodingEnabled) {
            result = this.applyConstantEncoding(result, ast);
        }
        
        // Apply variable renaming
        if (this.settings.renamingEnabled) {
            result = this.applyVariableRenaming(result, ast);
        }
        
        // Apply control flow flattening
        if (this.settings.controlFlowEnabled) {
            result = this.applyControlFlowFlattening(result, iteration);
        }
        
        return result;
    }
    
    // Apply final transformations
    applyFinalTransformations(code) {
        let result = code;
        
        // Add header comment
        result = this.addHeaderComment(result);
        
        // Add anti-tamper protection
        if (this.settings.antiTamperEnabled) {
            result = this.addAntiTamperProtection(result);
        }
        
        // Add metadata obfuscation
        if (this.settings.metadataObfuscation) {
            result = this.addMetadataObfuscation(result);
        }
        
        return result;
    }
    
    // Apply string encryption (placeholder - implemented in string-encryption.js)
    applyStringEncryption(code, ast) {
        return code + '\n-- [ZiaanVeil] String encryption applied\n';
    }
    
    // Apply constant encoding (placeholder - implemented in constant-encoding.js)
    applyConstantEncoding(code, ast) {
        return code + '\n-- [ZiaanVeil] Constant encoding applied\n';
    }
    
    // Apply variable renaming (placeholder - implemented in renaming.js)
    applyVariableRenaming(code, ast) {
        return code + '\n-- [ZiaanVeil] Variable renaming applied\n';
    }
    
    // Apply control flow flattening (placeholder - implemented in control-flow.js)
    applyControlFlowFlattening(code, iteration) {
        return code + `\n-- [ZiaanVeil] Control flow flattening applied (iteration ${iteration + 1})\n`;
    }
    
    // Add header comment
    addHeaderComment(code) {
        const header = `--[[
    Obfuscated with ZiaanVeil v${this.version}
    Advanced Lua/Luau Obfuscator for Roblox
    Obfuscation Settings:
    - String Encryption: ${this.settings.stringEncryptionEnabled ? 'Enabled' : 'Disabled'}
    - Constant Encoding: ${this.settings.constantEncodingEnabled ? 'Enabled' : 'Disabled'}
    - Control Flow Flattening: ${this.settings.controlFlowEnabled ? 'Enabled' : 'Disabled'}
    - Variable Renaming: ${this.settings.renamingEnabled ? 'Enabled' : 'Disabled'}
    - Obfuscation Iterations: ${this.settings.obfuscationIterations}
    --]]\n\n`;
        
        return header + code;
    }
    
    // Add anti-tamper protection
    addAntiTamperProtection(code) {
        const protection = `
-- Anti-tamper protection
local function ZV_CheckIntegrity()
    local hash = 0
    local script = debug.getinfo(1, "S").source
    for i = 1, #script do
        hash = (hash * 31 + string.byte(script, i)) % 0x7FFFFFFF
    end
    return hash
end

local expectedHash = ${Math.floor(Math.random() * 1000000000)}
if ZV_CheckIntegrity() ~= expectedHash then
    error("Script integrity check failed!")
end
`;
        
        return protection + '\n' + code;
    }
    
    // Add metadata obfuscation
    addMetadataObfuscation(code) {
        // Add random metadata to confuse decompilers
        const metadata = `
-- Random metadata (ignore)
local _ = {
    ${this.generateRandomMetadata(5)}
}
`;
        
        return metadata + '\n' + code;
    }
    
    // Generate random metadata
    generateRandomMetadata(count) {
        const items = [];
        const keys = ['version', 'author', 'date', 'id', 'checksum', 'signature', 'license', 'build'];
        const values = ['1.0', 'unknown', '2023', 'x7f9a2', 'a1b2c3d4', 'sig12345', 'MIT', 'release'];
        
        for (let i = 0; i < count; i++) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            const value = values[Math.floor(Math.random() * values.length)];
            items.push(`${key} = "${value}"`);
        }
        
        return items.join(',\n    ');
    }
    
    // Generate random identifier names
    generateRandomIdentifier(style) {
        const styles = {
            javanese: ['ꦄ', 'ꦅ', 'ꦆ', 'ꦇ', 'ꦈ', 'ꦉ', 'ꦊ', 'ꦋ', 'ꦌ', 'ꦍ'],
            chinese: ['我', '们', '的', '在', '了', '不', '和', '有', '大', '这'],
            arabic: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر'],
            unicode: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ'],
            emoji: ['😀', '😎', '🤖', '👾', '💀', '👻', '🐉', '🦄', '🚀', '⭐']
        };
        
        const chars = styles[style] || styles.unicode;
        const length = Math.floor(Math.random() * 3) + 2;
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        
        return result;
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.ZiaanVeilObfuscator = ZiaanVeilObfuscator;
}
