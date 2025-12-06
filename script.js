document.addEventListener('DOMContentLoaded', function() {
    const obfuscator = new ZiaanVeilObfuscator();
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const exampleBtn = document.getElementById('exampleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Statistik
    const inputLines = document.getElementById('inputLines');
    const outputLines = document.getElementById('outputLines');
    const processTime = document.getElementById('processTime');
    const obfRatio = document.getElementById('obfRatio');
    
    // Konfigurasi
    const xorKey = document.getElementById('xorKey');
    const xorKeyValue = document.getElementById('xorKeyValue');
    const junkLevel = document.getElementById('junkLevel');
    const junkLevelValue = document.getElementById('junkLevelValue');
    
    // Update stats
    function updateStats() {
        const input = inputCode.value;
        const output = outputCode.textContent;
        
        inputLines.textContent = input.split('\n').length;
        outputLines.textContent = output.split('\n').length;
        
        if (input.length > 0 && output.length > 0) {
            const ratio = Math.round((output.length / input.length) * 100);
            obfRatio.textContent = ratio + '%';
        }
    }
    
    // Update slider values
    xorKey.addEventListener('input', function() {
        xorKeyValue.textContent = this.value;
    });
    
    junkLevel.addEventListener('input', function() {
        junkLevelValue.textContent = this.value;
    });
    
    // Obfuscate button click
    obfuscateBtn.addEventListener('click', function() {
        const startTime = performance.now();
        
        // Get configuration
        const config = {
            enableStringEnc: document.getElementById('enableStringEnc').checked,
            enableBase64: document.getElementById('enableBase64').checked,
            enableXOR: document.getElementById('enableXOR').checked,
            xorKey: parseInt(xorKey.value),
            enableControlFlow: document.getElementById('enableControlFlow').checked,
            enableJunkCode: document.getElementById('enableJunkCode').checked,
            junkLevel: parseInt(junkLevel.value),
            enableRenaming: document.getElementById('enableRenaming').checked,
            renameType: document.querySelector('input[name="renameType"]:checked').value,
            obfLevel: document.querySelector('input[name="obfLevel"]:checked').value,
            enableBytecode: document.getElementById('enableBytecode').checked,
            enableInterpreter: document.getElementById('enableInterpreter').checked,
            enableConstantEnc: document.getElementById('enableConstantEnc').checked,
            enableCompression: document.getElementById('enableCompression').checked
        };
        
        // Apply obfuscation level presets
        applyObfuscationLevel(config.obfLevel, config);
        
        // Set obfuscator options
        obfuscator.setOptions(config);
        
        // Obfuscate the code
        const code = inputCode.value;
        const obfuscatedCode = obfuscator.obfuscate(code);
        
        // Display result
        outputCode.textContent = obfuscatedCode;
        
        // Update stats
        const endTime = performance.now();
        processTime.textContent = Math.round(endTime - startTime) + 'ms';
        updateStats();
        
        // Add success animation
        this.innerHTML = '<i class="fas fa-check"></i> Berhasil!';
        this.classList.add('success');
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-magic"></i> Obfuscate Kode';
            this.classList.remove('success');
        }, 2000);
    });
    
    // Apply obfuscation level presets
    function applyObfuscationLevel(level, config) {
        switch(level) {
            case 'low':
                config.enableJunkCode = false;
                config.junkLevel = 1;
                config.enableBytecode = false;
                config.enableInterpreter = false;
                break;
            case 'high':
                config.enableJunkCode = true;
                config.junkLevel = 4;
                config.enableBytecode = true;
                config.enableInterpreter = true;
                break;
            case 'extreme':
                config.enableStringEnc = true;
                config.enableBase64 = true;
                config.enableXOR = true;
                config.enableControlFlow = true;
                config.enableJunkCode = true;
                config.junkLevel = 5;
                config.enableRenaming = true;
                config.renameType = 'mix';
                config.enableBytecode = true;
                config.enableInterpreter = true;
                config.enableConstantEnc = true;
                config.enableCompression = true;
                break;
        }
        
        // Update UI to match
        document.getElementById('enableStringEnc').checked = config.enableStringEnc;
        document.getElementById('enableBase64').checked = config.enableBase64;
        document.getElementById('enableXOR').checked = config.enableXOR;
        document.getElementById('enableControlFlow').checked = config.enableControlFlow;
        document.getElementById('enableJunkCode').checked = config.enableJunkCode;
        document.getElementById('enableRenaming').checked = config.enableRenaming;
        document.getElementById('enableBytecode').checked = config.enableBytecode;
        document.getElementById('enableInterpreter').checked = config.enableInterpreter;
        document.getElementById('enableConstantEnc').checked = config.enableConstantEnc;
        document.getElementById('enableCompression').checked = config.enableCompression;
        
        // Update radio buttons
        document.querySelector(`input[name="renameType"][value="${config.renameType}"]`).checked = true;
        
        // Update sliders
        junkLevel.value = config.junkLevel;
        junkLevelValue.textContent = config.junkLevel;
    }
    
    // Copy to clipboard
    copyBtn.addEventListener('click', function() {
        const code = outputCode.textContent;
        if (!code.trim()) return;
        
        navigator.clipboard.writeText(code).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Disalin!';
            this.classList.add('success');
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('success');
            }, 2000);
        });
    });
    
    // Download code
    downloadBtn.addEventListener('click', function() {
        const code = outputCode.textContent;
        if (!code.trim()) return;
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated_code.lua';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Load example code
    exampleBtn.addEventListener('click', function() {
        const exampleCode = `-- Contoh kode Lua untuk Roblox
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

local dataStore = DataStoreService:GetDataStore("PlayerData")

function savePlayerData(player)
    local userId = player.UserId
    local data = {
        Coins = 1000,
        Level = 1,
        Experience = 0,
        Inventory = {"Sword", "Shield"}
    }
    
    local success, err = pcall(function()
        dataStore:SetAsync(tostring(userId), data)
    end)
    
    if success then
        print("Data saved for " .. player.Name)
    else
        warn("Failed to save data: " .. err)
    end
end

function calculateDamage(attacker, target)
    local baseDamage = 10
    local multiplier = 1.5
    local critical = math.random() < 0.2
    
    if critical then
        multiplier = 3.0
        print("CRITICAL HIT!")
    end
    
    return baseDamage * multiplier
end

Players.PlayerAdded:Connect(function(player)
    print(player.Name .. " joined the game!")
    savePlayerData(player)
    
    player.CharacterAdded:Connect(function(character)
        print("Character loaded for " .. player.Name)
    end)
end)`;
        
        inputCode.value = exampleCode;
        updateStats();
    });
    
    // Clear input
    clearBtn.addEventListener('click', function() {
        inputCode.value = '';
        outputCode.textContent = '';
        updateStats();
    });
    
    // Reset settings
    resetBtn.addEventListener('click', function() {
        document.getElementById('enableStringEnc').checked = true;
        document.getElementById('enableBase64').checked = true;
        document.getElementById('enableXOR').checked = true;
        document.getElementById('xorKey').value = 135;
        xorKeyValue.textContent = '135';
        document.getElementById('enableControlFlow').checked = true;
        document.getElementById('enableJunkCode').checked = true;
        document.getElementById('junkLevel').value = 3;
        junkLevelValue.textContent = '3';
        document.getElementById('enableRenaming').checked = true;
        document.querySelector('input[name="renameType"][value="jawa"]').checked = true;
        document.querySelector('input[name="obfLevel"][value="medium"]').checked = true;
        document.getElementById('enableBytecode').checked = true;
        document.getElementById('enableInterpreter').checked = true;
        document.getElementById('enableConstantEnc').checked = true;
        document.getElementById('enableCompression').checked = true;
        
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Reset!';
        this.classList.add('success');
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('success');
        }, 2000);
    });
    
    // Real-time stats update
    inputCode.addEventListener('input', updateStats);
    
    // Initialize stats
    updateStats();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            obfuscateBtn.click();
        }
        if (e.ctrlKey && e.key === 'c' && e.target !== inputCode) {
            copyBtn.click();
        }
        if (e.ctrlKey && e.key === 'd') {
            downloadBtn.click();
        }
    });
});
