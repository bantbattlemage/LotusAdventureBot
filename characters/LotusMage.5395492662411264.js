//load_file("C:/GitHub/lotusAdventureBot/characters/LotusMage.5395492662411264.js");

let EnergizeRotation = ["LotusRanger", "RangerLotus"];
let EnergizeTick = 0;

function loadCharacter()
{
	let settings =
	{
		"FarmMap": "main",
		"FarmMonster": "crabx",
		"FarmSpawn": 5,
		//"FarmMap": "tunnel",
		//"FarmMonster": "mole",
		//"FarmSpawn": 8,
		"PriorityTargets": ["phoenix","goldenbat"],
		"Party": ["LotusRanger", "RangerLotus", "LotusMage", "LotusMerch"],
		"TetherRadius": 100,
		"VendorTrash": VendorTrash
	};

	startBotCore(settings);
	Flags["Farming"] = true;
	Flags["Kiting"] = false;
}

function characterCombat(target)
{
	if (castEnergize())
	{
		return true;
	}

	if (castScare(target))
	{
		return true;
	}

	if (castReflection())
	{
		return true;
	}
	return false;
}

function castScare(target)
{
	if (character.mp < G.skills.scare.mp || is_on_cooldown("scare") || !is_in_range(target, "scare") || !target)
	{
		return false;
	}

	use_skill("scare", target);
	reduce_cooldown("scare", character.ping);

	return true;
}

function castReflection()
{
	if (character.mp < G.skills.reflection.mp || is_on_cooldown("reflection"))
	{
		return false;
	}

	let target = null;

	for (let i = 0; i < EnergizeRotation.length; i++)
	{
		target = parent.entities[EnergizeRotation[EnergizeTick]];
		EnergizeTick++;
		if (EnergizeTick >= EnergizeRotation.length)
		{
			EnergizeTick = 0;
		}

		if (target != null && !target.rip)
		{
			break;
		}
	}

	if (target === null)
	{
		return false;
	}

	if (target && !target.s.reflection && is_in_range(target, "reflection"))
	{
		use_skill("reflection", target);
		reduce_cooldown("reflection", character.ping);

		return true;
	}

	return false;
}

function castEnergize()
{
	if (character.mp < G.skills.energize.mp || is_on_cooldown("reflection"))
	{
		return false;
	}

	let target = null;

	for (let i = 0; i < EnergizeRotation.length; i++)
	{
		target = parent.entities[EnergizeRotation[EnergizeTick]];
		EnergizeTick++;
		if (EnergizeTick >= EnergizeRotation.length)
		{
			EnergizeTick = 0;
		}

		if (target != null && !target.rip)
		{
			break;
		}
	}

	if (target === null)
	{
		return false;
    }

	if (target && !target.s.energized && is_in_range(target, "energize"))
	{
		use_skill("energize", target);
		reduce_cooldown("energize", character.ping);

		return true;
	}

	return false;
}