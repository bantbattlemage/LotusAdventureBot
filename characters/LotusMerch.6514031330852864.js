//load_file("C:/GitHub/lotusAdventureBot/characters/LotusMerch.6514031330852864.js");

function loadCharacter()
{
	let defaultUpgradeLevel = 8;
	let defaultCompoundLevel = 2;
	let upgradeList =
		{
			"wattire": defaultUpgradeLevel,
			"wshoes": defaultUpgradeLevel,
			"wbreeches": defaultUpgradeLevel,
			"wcap": defaultUpgradeLevel,
			"wgloves": defaultUpgradeLevel,
			"coat": defaultUpgradeLevel,
			"shoes": defaultUpgradeLevel,
			"pants": defaultUpgradeLevel,
			"helmet": defaultUpgradeLevel,
			"gloves": defaultUpgradeLevel,
			"wshield": defaultUpgradeLevel,
			"coat1": 7,
			"shoes1": 7,
			"pants1": 7,
			"helmet1": 7,
			"gloves1": 7,
			"quiver": 7,
			"firestaff": 5,
			"mushroomstaff":7,
			"hbow":7,
			"t2bow": 7,
			"firebow": 5,
		};
	let compoundList =
		{
			"intearring": defaultCompoundLevel,
			"dexearring": defaultCompoundLevel,
			"strearring": defaultCompoundLevel,
			"hpbelt": defaultCompoundLevel,
			"vitring": defaultCompoundLevel,
			"vitearring": defaultCompoundLevel,
			"wbook0": 3,
			"skullamulet": 1,
			"lantern": 1,
			"jacko": 1
		};
	let pontyList = 
		[
			"ascale", "cscale", "pleather", "bfur", "seashell", "leather", "firestaff", "suckerpunch", "t2dexamulet", "t2intamulet", "rabbitsfoot", "ringofluck", "cape", 
			"ecape", "angelwings", "bcape", "orbg", "hbow", "t2bow", "seashell"
		];
	let holdItems = 
		[
			"stand0", "scroll0", "scroll1", "cscroll0", "cscroll1", "stand0", "hpot1", "mpot1", "elixirint0", "elixirdex0"
		];

	let settings =
	{
			"PartyLeader": true,
			"Party": ["LotusRanger", "RangerLotus", "LotusMage", "LotusMerch"],
			"HomeMap": "main",
			"HomeCoords": {x: -118, y: 11},
			"HoldItems": holdItems,
			"UpgradeList": upgradeList,
			"CompoundList": compoundList,
			"VendorTrash": VendorTrash,
			"PontyList": pontyList,
			"LowInventory": 3
	};
	
	startBotCore(settings);
	startMerchantBot();
	
	Intervals["Reload"] = setInterval(()=>
	{
		loadAllRunners();
	}, 10000);
}