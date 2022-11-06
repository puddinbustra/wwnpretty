
# Installing
This is not the official system for WWN, so you will have to manually install this one. To install,
click 'install system' in Foundry, and then submit this system's manifest: https://raw.githubusercontent.com/puddinbustra/wwnpretty/main/system.json

To install my version of Crash's roll hider, drop 'blind-roll-skills' from this system into the "modules" folder in your foundry directory. It should then automatically show up in Foundry's modules tab. 

Please note this system probably only compatible with Foundry 0.8.8 or so, so you may need to actively install that version from the Foundry website. 

# About

This sheet is for Worlds Without Number. I currently have some adjustments such as the notice being skill removed, and replaced by hear, smell and see. If you don't like these and want to change them, modifying the code isn't that hard. 

![Preview](preview.png?raw=true)

# Features
- Included my altered version of Crash's roll hider. 
- Aesthetically pleasing.
- Enough space and information to conveniently manage both PCs and NPCs.

# Setup notes
- Armor class is controlled by armor you put on, but that can be changed by clicking the gear around armor class
- Level is changed by adding a level under the features tab. New save values are calculated automatically
- 'Global Bonuses' under the extras tab allows you to change base attack bonus, damage, etc. It also lets you change the base formula for skill calculations, such as roll 3d6 keep the two highest.
- I have broken up the notice skill into 3 sensory skills, since I'm running an animal game. To revert this, you'd need to go into the code and remove all instances of sensory skills, and add a notice skill in their place - admitedely a pain if you never work with code. 
- If you want to customize the background from the green I have now, just place another file named 'parchment' in the ui folder. If you want to change the colors of highlights, and text boxes and such, you'll need to go into the wwnpretty css file, and change the relevant color codes. 

# Contact
If you have any other feedback, be it suggestions or support, send me a message on discord - lofty#8637.

# Compatability
Since this is mostly based off of the 5e character sheet, many of the modules compatible with that should require minimal changes to function here. Stuff like token modules, map modules, and chat modules should work. 


# Maintaining Code
In the unlikely scenario of this sheet becoming popular, I may update it for new Foundry versions. Otherwise, it will likely remain as it stands. 
