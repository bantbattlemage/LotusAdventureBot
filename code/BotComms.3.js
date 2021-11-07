﻿const WhiteList = [];

function initBotComms()
{
	Settings["Party"].forEach((x)=>
	{
		WhiteList.push(x);
	});
	
	sendPartyInvites();
}

function on_cm(sender, data)
{
	if (!WhiteList.includes(sender))
	{
		log(character.name + " recieved unexpected cm from " + sender);
		show_json(data);
		return;
	}
	else if (!data.message)
	{
		log(character.name + " recieved unexpected cm format from " + sender);
		show_json(data);
		return;
	}

	game.trigger("codeMessage", {sender:sender, data:data});
	
	switch (data.message)
	{
		case "party":
			if (parent.party_list.length > 1 && Settings["PartyLeader"])
			{
				send_party_invite(sender);
			}
			break;
		default:
			break;
	}
}

function on_party_invite(inviter)
{
	log(character.name + " recieved party invite from " + inviter);

	if (WhiteList.includes(inviter))
	{
		if(parent.party_list.length <= 1)
		{
			accept_party_invite(inviter);
		}
		else if(Settings["Party"].includes(inviter) && Settings["PartyLeader"])
		{
			send_party_invite(inviter);
		}
	}
}

function sendCodeMessage(recipient, data)
{
	if (!data.message || recipient === character.name)
	{
		log(character.name + " tried to send unexpected cm format to " + recipient);
		show_json(data);
		return;
	}
	
	if(!data.location)
	{
		data.location = 
			{
				map: character.map,
				position: {x: character.x, y: character.y}
			}
	}
	
	send_cm(recipient, data);
}

function getOnlineCharacters()
{
	return parent.X.characters.filter((x) => { return x.online > 0; });
}

function getOnlineMerchant()
{
	let merchants = parent.X.characters.filter((x) =>
	{
		return x.type === "merchant" && x.online > 0;
	});
	
	if(merchants.length > 0)
	{
		return merchants[0];
	}
	else
	{
		return false;
	}
}

function getOnlineMage()
{
	return parent.X.characters.filter((x) =>
	{
		return x.type === "mage" && x.online > 0;
	})[0];
}

function requestMerchant(message)
{
	let merchant = getOnlineMerchant();
	
	if(merchant)
	{
		sendCodeMessage(merchant.name, message);
		return true;
	}
	else
	{
		return false;
	}

}

function sendPartyInvites()
{
	if (!Settings["PartyLeader"])
	{
		return;
    }

	for(let index in Settings["Party"])
	{
		let name = Settings["Party"][index];
		if(name === character.name)
		{
			continue;
		}
		
		let cm = {message:"party"};
		send_party_invite(name);
		sendCodeMessage(name, cm);
	}
}

function reloadCharacters()
{
	for (let i = 0; i < parent.X.characters.length; i++)
	{
		let name = parent.X.characters[i].name;
		if (name !== character.name && get_active_characters()[name])
		{
			reloadCharacter(name);
		}
	}

	setTimeout(() =>
	{
		reloadCharacter(character.name);
	}, 1000);
}

function reloadCharacter(name)
{
	if(!name)
	{
		name = character.name;
	}
	
	if (name === character.name)
	{
		say("/pure_eval setTimeout(()=>{parent.start_runner()}, 500)");
		parent.stop_runner();
	} 
	else
	{
		command_character(name, "say(\"/pure_eval setTimeout(()=>{start_runner()}, 500)\")");
		command_character(name, "say(\"/pure_eval stop_runner();\")");
	}
}

function sendAllToTown()
{
	for (let i = 0; i < parent.X.characters.length; i++)
	{
		let name = parent.X.characters[i].name;
		if (name !== character.name && get_active_characters()[name])
		{
			command_character(name, "say(\"/pure_eval goToTown();\")");
		}
	}
}

function stopRunners()
{
	for (let i = 0; i < parent.X.characters.length; i++)
	{
		let name = parent.X.characters[i].name;
		if (name !== character.name && get_active_characters()[name])
		{
			stop_character(name);
		}
	}
}

function loadAllRunners()
{
	for (let i = 0; i < Settings["Party"].length; i++)
	{
		let name = Settings["Party"][i];
		let online = parent.X.characters.filter((x) => { return x.name === name && x.online > 0; }).length > 0;
		if (name !== character.name && !get_active_characters()[name] && !online)
		{
			log("Loading " + name + " as code runner");
			start_character(name, "Start");
		}
	}
}

function xpReport()
{
	let output = []

	for (let p of parent.X.characters)
	{
		let player = get_player(p);

		if (player)
		{
			let percent = (player.xp / G.levels[player.level]) * 100;
			output.push(player.name + ": L" + player.level + " with " + percent.toLocaleString(undefined, {maximumFractionDigits: 2}) + "%");
		}
	}

	show_json(output);
}