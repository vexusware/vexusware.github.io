// Constant Encoding Module for ZiaanVeil

class ConstantEncoder {
    constructor() {
        this.methods = {
            arithmetic: this.encodeArithmetic.bind(this),
            hex: this.encodeHex.bind(this),
            bitwise: this.encodeBitwise.bind(this),
            polynomial: this.encodePolynomial.bind(this)
        };
    }
    
    // Encode constants in Lua code
    encode(code, settings) {
        if (!settings.constantEncodingEnabled) return code;
        
        const method = this.methods[settings.constantEncodingMethod] || this.methods.arithmetic;
        
        // Find all numbers
        const numberRegex = /-?\b\d+(\.\d+)?\b/g;
        let result = code;
        let matches = [];
        let match;
        
        // Collect all matches
        while ((match = numberRegex.exec(code)) !== null) {
            // Check if this is part of a larger identifier (like variable1)
            const before = code[match.index - 1] || '';
            const after = code[match.index + match[0].length] || '';
            const isPartOfIdentifier = /[a-zA-Z_]/.test(before) || /[a-zA-Z_]/.test(after);
            
            if (!isPartOfIdentifier) {
                matches.push({
                    number: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    isFloat: match[0].includes('.')
                });
            }
        }
        
        // Replace numbers in reverse order
        for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i];
            
            // Skip float encoding if disabled
            if (m.isFloat && !settings.constantFloatEnabled) continue;
            
            const encoded = method(parseFloat(m.number), m.isFloat);
            result = result.substring(0, m.start) + encoded + result.substring(m.end);
        }
        
        // Encode boolean values if enabled
        if (settings.constantBoolEnabled) {
            result = this.encodeBooleans(result);
        }
        
        return result;
    }
    
    // Encode number using arithmetic operations
    encodeArithmetic(value, isFloat) {
        if (value === 0) return '0';
        if (value === 1) return '1';
        
        // Generate random arithmetic expression
        const operations = [
            () => `${value * 2} / 2`,
            () => `${value + 5} - 5`,
            () => `${value * 3} / 3`,
            () => `${value + 10} - 10`,
            () => `(${value * 4} - ${value * 2}) / 2`,
            () => `${value * 5} / 5`,
            () => `${value + 7} - 7`,
            () => `(${value * 6}) / 6`,
            () => `${value * 8} / 8`,
            () => `${value + 15} - 15`
        ];
        
        // For floats, use more precise operations
        if (isFloat) {
            const precision = 1000;
            const intValue = Math.round(value * precision);
            return `(${intValue} / ${precision})`;
        }
        
        const op = operations[Math.floor(Math.random() * operations.length)];
        return op();
    }
    
    // Encode number as hexadecimal or other base
    encodeHex(value, isFloat) {
        if (isFloat) {
            // For floats, use arithmetic encoding
            return this.encodeArithmetic(value, true);
        }
        
        // Convert to hex
        const hexValue = value.toString(16);
        return `0x${hexValue}`;
    }
    
    // Encode number using bitwise operations
    encodeBitwise(value, isFloat) {
        if (isFloat) {
            return this.encodeArithmetic(value, true);
        }
        
        // Generate bitwise expression
        const bitwiseOps = [
            () => `bit32.bxor(${value ^ 255}, 255)`,
            () => `bit32.bor(${value & ~15}, ${value & 15})`,
            () => `bit32.band(${value | 255}, 255)`,
            () => `bit32.bxor(bit32.bxor(${value}, 123), 123)`,
            () => `bit32.bor(bit32.band(${value}, 240), bit32.band(${value}, 15))`
        ];
        
        const op = bitwiseOps[Math.floor(Math.random() * bitwiseOps.length)];
        return op();
    }
    
    // Encode number as polynomial
    encodePolynomial(value, isFloat) {
        if (isFloat) {
            return this.encodeArithmetic(value, true);
        }
        
        // Generate polynomial expression
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = value - (a * b);
        
        return `(${a} * ${b}) + ${c}`;
    }
    
    // Encode boolean values
    encodeBooleans(code) {
        let result = code;
        
        // Replace true
        result = result.replace(/\btrue\b/g, () => {
            const options = [
                '1 == 1',
                'not false',
                '2 > 1',
                '3 >= 3',
                '5 ~= 6',
                '("a" == "a")'
            ];
            return options[Math.floor(Math.random() * options.length)];
        });
        
        // Replace false
        result = result.replace(/\bfalse\b/g, () => {
            const options = [
                '1 == 2',
                'not true',
                '2 < 1',
                '3 <= 2',
                '5 == 6',
                '("a" == "b")'
            ];
            return options[Math.floor(Math.random() * options.length)];
        });
        
        // Replace nil with complex expression
        result = result.replace(/\bnil\b/g, () => {
            const options = [
                '(function() return end)()',
                'type({}) == "nil" and nil or nil',
                '(({}).nonexistent)'
            ];
            return options[Math.floor(Math.random() * options.length)];
        });
        
        return result;
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.ConstantEncoder = ConstantEncoder;
}
