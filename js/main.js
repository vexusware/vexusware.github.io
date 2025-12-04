document.addEventListener('DOMContentLoaded', function() {
    // Initialize obfuscator
    const obfuscator = new ZiaanVeilObfuscator();
    
    // DOM Elements
    const inputCode = document.getElementById('input-code');
    const outputCode = document.getElementById('output-code');
    const charCount = document.getElementById('char-count');
    const outputSize = document.getElementById('output-size');
    const obfuscationLevel = document.getElementById('obfuscation-level');
    const processingTime = document.getElementById('processing-time');
    const levelText = document.getElementById('level-text');
    const intensitySlider = document.getElementById('intensity-slider');
    
    // Buttons
    const obfuscateBtn = document.getElementById('obfuscate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const presetBtn = document.getElementById('preset-btn');
    const testBtn = document.getElementById('test-btn');
    
    // Modal
    const modal = document.getElementById('presets-modal');
    const closeBtn = document.querySelector('.close');
    const presets = document.querySelectorAll('.preset');
    
    // Update character count
    inputCode.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
    
    // Obfuscate button click
    obfuscateBtn.addEventListener('click', function() {
        if (!inputCode.value.trim()) {
            alert('Please enter some Lua code to obfuscate.');
            return;
        }
        
        // Disable button during processing
        const originalText = obfuscateBtn.innerHTML;
        obfuscateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obfuscating...';
        obfuscateBtn.disabled = true;
        
        // Get current settings
        const settings = getCurrentSettings();
        
        // Apply intensity from slider
        settings.intensity = parseInt(intensitySlider.value);
        
        // Obfuscate the code
        setTimeout(() => {
            const result = obfuscator.obfuscate(inputCode.value, settings);
            
            outputCode.value = result.code;
            outputSize.textContent = result.obfuscatedSize;
            obfuscationLevel.textContent = result.obfuscationLevel + '%';
            processingTime.textContent = result.processingTime + 'ms';
            
            // Restore button
            obfuscateBtn.innerHTML = originalText;
            obfuscateBtn.disabled = false;
            
            // Show success message
            showNotification('Code obfuscated successfully! Applied techniques: ' + result.steps.join(', '));
        }, 100);
    });
    
    // Copy button click
    copyBtn.addEventListener('click', function() {
        if (!outputCode.value.trim()) {
            alert('No obfuscated code to copy.');
            return;
        }
        
        outputCode.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
        
        showNotification('Obfuscated code copied to clipboard!');
    });
    
    // Download button click
    downloadBtn.addEventListener('click', function() {
        if (!outputCode.value.trim()) {
            alert('No obfuscated code to download.');
            return;
        }
        
        const blob = new Blob([outputCode.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated_script.lua';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Obfuscated code downloaded!');
    });
    
    // Clear button click
    clearBtn.addEventListener('click', function() {
        inputCode.value = '';
        outputCode.value = '';
        charCount.textContent = '0';
        outputSize.textContent = '0';
        obfuscationLevel.textContent = '0%';
        processingTime.textContent = '0ms';
        
        showNotification('Cleared all code!');
    });
    
    // Sample button click
    sampleBtn.addEventListener('click', function() {
        const sampleCode = `-- Sample Roblox Lua Script
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local function onPlayerAdded(player)
    print("Player joined: " .. player.Name)
    
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100
    coins.Parent = leaderstats
    
    local level = Instance.new("NumberValue")
    level.Name = "Level"
    level.Value = 1
    level.Parent = leaderstats
    
    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.Died:Connect(function()
            print(player.Name .. " died!")
            wait(5)
            character:BreakJoints()
        end)
    end)
end

local function giveCoins(player, amount)
    local coins = player:FindFirstChild("leaderstats"):FindFirstChild("Coins")
    if coins then
        coins.Value = coins.Value + amount
        print("Gave " .. amount .. " coins to " .. player.Name)
        return true
    end
    return false
end

Players.PlayerAdded:Connect(onPlayerAdded)

-- Main game loop
while true do
    wait(60) -- Every minute
    
    for _, player in pairs(Players:GetPlayers()) do
        giveCoins(player, 10)
    end
    
    print("Distributed coins to all players")
end`;
        
        inputCode.value = sampleCode;
        charCount.textContent = sampleCode.length;
        
        showNotification('Loaded sample Roblox Lua script!');
    });
    
    // Preset button click
    presetBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Preset selection
    presets.forEach(preset => {
        preset.addEventListener('click', function() {
            const presetName = this.dataset.preset;
            
            if (presetName === 'custom') {
                showNotification('Using custom settings.');
            } else {
                const presetSettings = obfuscator.applyPreset(presetName);
                applySettingsToUI(presetSettings);
                showNotification(`Applied ${presetName} preset!`);
            }
            
            modal.style.display = 'none';
        });
    });
    
    // Test button click
    testBtn.addEventListener('click', function() {
        if (!outputCode.value.trim()) {
            alert('Please obfuscate some code first.');
            return;
        }
        
        // In a real implementation, this would open a Lua VM
        // For now, just show a message
        showNotification('Test feature would run in Lua VM. In browser implementation, this is simulated.');
        
        // Create a simple test environment simulation
        const testResult = simulateLuaTest(outputCode.value);
        alert(`Test Simulation Result:\n\n${testResult}`);
    });
    
    // Intensity slider
    intensitySlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        let level = '';
        
        if (value <= 3) level = 'Light';
        else if (value <= 5) level = 'Medium';
        else if (value <= 8) level = 'Heavy';
        else level = 'Extreme';
        
        levelText.textContent = level;
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Helper functions
    function getCurrentSettings() {
        return {
            stringEncryption: document.getElementById('string-encryption').checked,
            stringMethod: document.getElementById('string-method').value,
            stringObfuscateChars: document.getElementById('string-obfuscate-chars').checked,
            constantEncoding: document.getElementById('constant-encoding').checked,
            constantLevel: document.getElementById('constant-level').value,
            constantMath: document.getElementById('constant-math').checked,
            controlFlow: document.getElementById('control-flow').checked,
            flowIntensity: document.getElementById('flow-intensity').value,
            addJunkBlocks: document.getElementById('add-junk-blocks').checked,
            renaming: document.getElementById('renaming').checked,
            renameCharset: document.getElementById('rename-charset').value,
            preserveBuiltins: document.getElementById('preserve-builtins').checked,
            bytecodeGen: document.getElementById('bytecode-gen').checked,
            addVM: document.getElementById('add-vm').checked,
            vmComplexity: document.getElementById('vm-complexity').value,
            addJunkcode: document.getElementById('add-junkcode').checked,
            junkAmount: document.getElementById('junk-amount').value,
            antiTamper: document.getElementById('anti-tamper').checked,
            intensity: parseInt(intensitySlider.value)
        };
    }
    
    function applySettingsToUI(settings) {
        document.getElementById('string-encryption').checked = settings.stringEncryption;
        document.getElementById('string-method').value = settings.stringMethod;
        document.getElementById('string-obfuscate-chars').checked = settings.stringObfuscateChars;
        document.getElementById('constant-encoding').checked = settings.constantEncoding;
        document.getElementById('constant-level').value = settings.constantLevel;
        document.getElementById('constant-math').checked = settings.constantMath;
        document.getElementById('control-flow').checked = settings.controlFlow;
        document.getElementById('flow-intensity').value = settings.flowIntensity;
        document.getElementById('add-junk-blocks').checked = settings.addJunkBlocks;
        document.getElementById('renaming').checked = settings.renaming;
        document.getElementById('rename-charset').value = settings.renameCharset;
        document.getElementById('preserve-builtins').checked = settings.preserveBuiltins;
        document.getElementById('bytecode-gen').checked = settings.bytecodeGen;
        document.getElementById('add-vm').checked = settings.addVM;
        document.getElementById('vm-complexity').value = settings.vmComplexity;
        document.getElementById('add-junkcode').checked = settings.addJunkcode;
        document.getElementById('junk-amount').value = settings.junkAmount;
        document.getElementById('anti-tamper').checked = settings.antiTamper;
        intensitySlider.value = settings.intensity;
        
        // Update level text
        const value = parseInt(settings.intensity);
        let level = '';
        if (value <= 3) level = 'Light';
        else if (value <= 5) level = 'Medium';
        else if (value <= 8) level = 'Heavy';
        else level = 'Extreme';
        levelText.textContent = level;
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 40, 80, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            border-left: 4px solid #00ffff;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;
        
        // Add keyframe animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    function simulateLuaTest(code) {
        // Simple simulation of Lua test execution
        const lines = code.split('\n').length;
        const chars = code.length;
        const hasPrint = code.includes('print');
        const hasFunction = code.includes('function');
        const hasLoop = code.includes('while') || code.includes('for');
        
        return `Code Analysis:
        - Lines: ${lines}
        - Characters: ${chars}
        - Contains print statements: ${hasPrint ? 'Yes' : 'No'}
        - Contains functions: ${hasFunction ? 'Yes' : 'No'}
        - Contains loops: ${hasLoop ? 'Yes' : 'No'}
        
        Note: This is a simulation. In a real environment, the code would be executed in a Lua VM.`;
    }
    
    // Load default sample code
    sampleBtn.click();
});
