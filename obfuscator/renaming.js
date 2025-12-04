// Variable and Function Renaming Module for ZiaanVeil

class VariableRenamer {
    constructor() {
        this.characterSets = {
            javanese: this.getJavaneseCharacters(),
            chinese: this.getChineseCharacters(),
            arabic: this.getArabicCharacters(),
            unicode: this.getUnicodeCharacters(),
            emoji: this.getEmojiCharacters()
        };
        
        this.preservedIdentifiers = [
            // Roblox API
            'game', 'Workspace', 'Players', 'Lighting', 'ReplicatedStorage',
            'ServerStorage', 'ServerScriptService', 'StarterPlayer', 'StarterGui',
            'StarterPack', 'StarterCharacter', 'Team', 'Teams', 'UserInputService',
            'RunService', 'HttpService', 'TweenService', 'PathfindingService',
            'MarketplaceService', 'MessagingService', 'Chat', 'SoundService',
            'ScriptContext', 'Stats', 'LogService', 'NetworkServer',
            'NetworkClient', 'NetworkPeer', 'PhysicsService', 'CollectionService',
            'TestService', 'ContentProvider', 'ContextActionService', 'ControllerService',
            'CookieService', 'DataStoreService', 'Debris', 'Geometry', 'GuiService',
            'HapticService', 'LocalizationService', 'MaterialService', 'NotificationService',
            'PackageService', 'PolicyService', 'RenderSettings', 'RuntimeScriptService',
            'SocialService', 'SolidModelContentProvider', 'TextureContentProvider',
            'TouchInputService', 'VirtualInputManager', 'VirtualUser',
            
            // Lua standard library
            'assert', 'collectgarbage', 'dofile', 'error', 'getmetatable',
            'ipairs', 'load', 'loadstring', 'next', 'pairs', 'pcall',
            'print', 'rawequal', 'rawget', 'rawset', 'select', 'setmetatable',
            'tonumber', 'tostring', 'type', 'unpack', '_VERSION', 'xpcall',
            
            // Lua math library
            'math', 'abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos',
            'cosh', 'deg', 'exp', 'floor', 'fmod', 'frexp', 'ldexp', 'log',
            'log10', 'max', 'min', 'modf', 'pow', 'rad', 'random', 'randomseed',
            'sin', 'sinh', 'sqrt', 'tan', 'tanh',
            
            // Lua string library
            'string', 'byte', 'char', 'dump', 'find', 'format', 'gmatch',
            'gsub', 'len', 'lower', 'match', 'rep', 'reverse', 'sub', 'upper',
            
            // Lua table library
            'table', 'concat', 'insert', 'maxn', 'remove', 'sort',
            
            // Lua coroutine library
            'coroutine', 'create', 'resume', 'running', 'status', 'wrap', 'yield',
            
            // Luau specific
            'bit32', 'band', 'bnot', 'bor', 'bxor', 'lshift', 'rshift', 'arshift',
            'btest', 'extract', 'replace',
            
            // Common variable names to preserve
            'self', 'arg', '...', '_', '__index', '__newindex', '__call',
            '__mode', '__metatable', '__tostring', '__len', '__unm', '__add',
            '__sub', '__mul', '__div', '__mod', '__pow', '__concat', '__eq',
            '__lt', '__le'
        ];
        
        this.renamedMap = new Map();
        this.identifierCounter = 0;
    }
    
    // Rename variables and functions in Lua code
    rename(code, settings) {
        if (!settings.renamingEnabled) return code;
        
        const style = settings.renamingStyle;
        const preserveAPI = settings.renamingPreserve;
        const minify = settings.renamingMinify;
        
        // Reset state
        this.renamedMap.clear();
        this.identifierCounter = 0;
        
        // Extract all identifiers
        const identifiers = this.extractIdentifiers(code);
        
        // Create mapping for identifiers to rename
        const mapping = this.createRenamingMapping(identifiers, style, preserveAPI, minify);
        
        // Apply renaming
        let result = code;
        
        // Replace in reverse order to avoid partial replacements
        const sortedIdentifiers = [...mapping.keys()].sort((a, b) => b.length - a.length);
        
        for (const oldName of sortedIdentifiers) {
            const newName = mapping.get(oldName);
            if (newName && newName !== oldName) {
                // Use regex with word boundaries to avoid partial matches
                const regex = new RegExp(`\\b${this.escapeRegExp(oldName)}\\b`, 'g');
                result = result.replace(regex, newName);
            }
        }
        
        return result;
    }
    
    // Extract all identifiers from code
    extractIdentifiers(code) {
        const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        const identifiers = new Set();
        let match;
        
        while ((match = identifierRegex.exec(code)) !== null) {
            // Skip Lua keywords
            const keywords = [
                'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for', 
                'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat', 
                'return', 'then', 'true', 'until', 'while', 'goto'
            ];
            
            if (!keywords.includes(match[1])) {
                identifiers.add(match[1]);
            }
        }
        
        return Array.from(identifiers);
    }
    
    // Create renaming mapping
    createRenamingMapping(identifiers, style, preserveAPI, minify) {
        const mapping = new Map();
        
        for (const identifier of identifiers) {
            // Check if we should preserve this identifier
            if (preserveAPI && this.preservedIdentifiers.includes(identifier)) {
                continue;
            }
            
            // Check if identifier is likely a Roblox service (starts with capital)
            if (preserveAPI && /^[A-Z]/.test(identifier)) {
                continue;
            }
            
            // Generate new name
            let newName;
            
            if (minify) {
                newName = this.generateMinifiedName();
            } else {
                newName = this.generateRandomName(style);
            }
            
            mapping.set(identifier, newName);
        }
        
        return mapping;
    }
    
    // Generate random name based on style
    generateRandomName(style) {
        this.identifierCounter++;
        
        const chars = this.characterSets[style] || this.characterSets.unicode;
        
        // Generate name with 2-4 characters
        const length = Math.floor(Math.random() * 3) + 2;
        let name = '';
        
        for (let i = 0; i < length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            name += char;
        }
        
        // Add counter to ensure uniqueness
        return `${name}_${this.identifierCounter}`;
    }
    
    // Generate minified name (a, b, c, ... aa, ab, ...)
    generateMinifiedName() {
        this.identifierCounter++;
        
        let result = '';
        let n = this.identifierCounter;
        
        while (n > 0) {
            n--;
            result = String.fromCharCode(97 + (n % 26)) + result;
            n = Math.floor(n / 26);
        }
        
        return result;
    }
    
    // Get Javanese characters
    getJavaneseCharacters() {
        return [
            'ꦄ', 'ꦅ', 'ꦆ', 'ꦇ', 'ꦈ', 'ꦉ', 'ꦊ', 'ꦋ', 'ꦌ', 'ꦍ',
            'ꦎ', 'ꦏ', 'ꦐ', 'ꦑ', 'ꦒ', 'ꦓ', 'ꦔ', 'ꦕ', 'ꦖ', 'ꦗ',
            'ꦘ', 'ꦙ', 'ꦚ', 'ꦛ', 'ꦜ', 'ꦝ', 'ꦞ', 'ꦟ', 'ꦠ', 'ꦡ',
            'ꦢ', 'ꦣ', 'ꦤ', 'ꦥ', 'ꦦ', 'ꦧ', 'ꦨ', 'ꦩ', 'ꦪ', 'ꦫ',
            'ꦬ', 'ꦭ', 'ꦮ', 'ꦯ', 'ꦰ', 'ꦱ', 'ꦲ', '꦳', 'ꦴ', 'ꦵ'
        ];
    }
    
    // Get Chinese characters
    getChineseCharacters() {
        return [
            '我', '们', '的', '在', '了', '不', '和', '有', '大', '这',
            '主', '中', '人', '上', '为', '们', '个', '用', '工', '时',
            '要', '动', '国', '产', '以', '我', '到', '他', '会', '作',
            '来', '分', '生', '对', '于', '学', '下', '级', '就', '年',
            '阶', '义', '发', '成', '部', '民', '可', '出', '能', '方'
        ];
    }
    
    // Get Arabic characters
    getArabicCharacters() {
        return [
            'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر',
            'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف',
            'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ة', 'ى',
            'آ', 'إ', 'ئ', 'ؤ', 'ء', 'ـ', 'َ', 'ُ', 'ِ', 'ّ',
            'ْ', 'ٰ', 'ٱ', '۟', '۠', 'ۢ', 'ۣ', 'ۥ', 'ۦ', 'ۧ'
        ];
    }
    
    // Get Unicode characters
    getUnicodeCharacters() {
        return [
            'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ',
            'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ',
            'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ',
            'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π',
            'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω', '∫', '∑'
        ];
    }
    
    // Get Emoji characters
    getEmojiCharacters() {
        return [
            '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
            '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
            '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
            '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
            '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬'
        ];
    }
    
    // Escape regex special characters
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.VariableRenamer = VariableRenamer;
}
