local function SafeGet(url)
    local ok, result = pcall(function()
        return game:HttpGet(url)
    end)
    return ok and result or nil
end

local data = SafeGet("https://raw.githubusercontent.com/vexusware/vexusware.github.io/refs/heads/main/src/vexus/vexusware.lua")
if not data then return end

-- Perbaikan: loadstring(data)() bukan game:HttpGet("data")()
local Games = loadstring(data)()

local URL = Games[game.PlaceId]
if not URL then return end

local scriptContent = SafeGet(URL)
if not scriptContent then return end

-- Perbaikan: loadstring(scriptContent)() bukan game:HttpGet(scriptContent)()
loadstring(scriptContent)()
