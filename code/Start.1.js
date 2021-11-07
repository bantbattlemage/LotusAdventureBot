let characterSlotIDs =
{
	"LotusMage": "5395492662411264",
	"LotusMerch": "6514031330852864",
	"LotusRanger": "4522122404167680",
	"RangerLotus": "6290619425619968",
};

function load_file(fileName)
{
	const fs = require('fs')
	let data = fs.readFileSync(fileName, 'utf8')
	let library = document.createElement("script");
	library.type = "text/javascript";
	library.text = data;
	document.getElementsByTagName("head")[0].appendChild(library);
}

if (parent.caracAL)
{
	parent.caracAL.load_scripts(["code/Logging.2.js", "code/BotComms.3.js", "code/StandardBot.4.js", "code/MerchantBot.5.js", "code/Crafting.6.js", "code/Positioning.7.js"]).then(() =>
	{
		let path = "characters/" + character.name + "." + characterSlotIDs[character.name] + ".js";

		parent.caracAL.load_scripts([path]).then(() =>
		{
			loadCharacter();
		});
	});
}
else
{
	load_code("Logging");
	load_code("BotComms");
	load_code("StandardBot");
	load_code("MerchantBot");
	load_code("Crafting");
	load_code("Positioning");
	load_code(character.name);

	map_key("1", "snippet", "xpReport()");
	map_key("2", "snippet", "reloadCharacter()");
	map_key("3", "snippet", "reloadCharacters()");
	map_key("4", "snippet", "stopRunners()");
	map_key("5", "snippet", "loadAllRunners()");
	map_key("6", "snippet", "");
	map_key("7", "snippet", "");
	map_key("8", "snippet", "");
	map_key("9", "snippet", "");
	map_key("0", "snippet", "");

	loadCharacter();
}