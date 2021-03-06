function startMerchantBot()
{
	Settings["PotionStock"] = 5000;
	Settings["LowPotions"] = 1000;
	/*Settings["LowInventory"] = 3;*/
	
	game.on("stateChanged", onMerchantStateChanged);
	game.on("codeMessage", onMerchantCM);
	game.on("idle", onMerchantIdle);
	
	Intervals["Mluck"] = setInterval(()=>
	{
		if(character.rip)
		{
			return;
		}
		
		if (!checkMluck(character))
		{
			use_skill("mluck", character);
		}

		for (let e in parent.entities)
		{
			let entity = parent.entities[e];
			if (character.mp >= 10 && entity && entity.player && !entity.npc && !checkMluck(entity) && is_in_range(entity, "mluck") && entity.ctype != "merchant")
			{
				log("Mlucking " + entity.name);
				use_skill("mluck", entity);
			}
		}
		
	}, 1000);

	log(character.name + " MerchantBot loaded!");
}

function onMerchantCM(data)
{
	if(character.rip)
	{
		return;
	}
	
	let sender = data.sender;
	data = data.data;
	
	switch (data.message)
	{
		case "NeedElixir":

			if (getState("Delivering") || getElixirInventorySlot(data.elixir) === null)
			{
				break;
			}

			deliverElixir(sender, data);

			break;

		case "NeedPotions":

			if (getState("Delivering"))
			{
				break;
			}
			if(quantity("hpot1") >= Settings["LowPotions"] && quantity("mpot1") >= Settings["LowPotions"])
			{
				deliverPotions(sender, data);
			}
			else if(!getState("NeedPotions"))
			{
				setState("NeedPotions");	
			}

			break;

		default:

			log("Unknown command");

			break;
	}
}

function onMerchantStateChanged(newState)
{
	stopTownInterval();
	parent.close_merchant();
	
	switch (newState)
	{
		case "Exchanging":
			break;
		case "Town":
			enterTownMode();
			break;
		case "Dead":
			if(Intervals["Deliver"])
			{
				Flags["DeliverTarget"] = null;
				clearInterval(Intervals["Deliver"]);
			}
			break;
	}
}

function onMerchantIdle()
{
	if(isInTown())
	{
		setState("Town");
	}
}

//	merchant main interval
function townInterval()
{
	if (is_moving(character) || smart.moving)
	{
		parent.close_merchant();
	}
	else if (!parent.stand && !is_moving(character) && !smart.moving)
	{
		parent.open_merchant(locate_item("stand0"));
	}

	if (!isInTown())
	{
		return;
	}

	sellVendorTrash();

	if (!smart.moving && !character.q.upgrade && !character.q.compound && !character.q.exchange)
	{
		let busy = false;
		busy = craftUpgrades();

		if (!busy)
		{
			busy = craftCompounds();
		}

		if (busy && getState("Exchanging"))
		{
			setState("Exchanging", false);
        }

		if (character.esize < Settings["LowInventory"])
		{
			return;
        }

		if (!busy)
		{
			busy = exchangeSeashells();
		}

		if (!busy)
		{
			busy = exchangeEmeralds();
		}

		if (!busy)
		{
			busy = exchangeArmorWeaponBoxes();
		}

		//	enable for Halloween
		//if (!busy)
		//{
		//	busy = exchangeCandies();
		//}
	}
}

function exchangeArmorWeaponBoxes()
{
	if (smart.moving)
	{
		return false;
	}

	let box = character.items[locate_item_greatest_quantity("armorbox")];

	if (!box)
	{
		box = character.items[locate_item_greatest_quantity("weaponbox")];
	}

	if (!box)
	{
		return false;
	}

	writeToLog("Exchanging " + box.name + "...");
	exchangeItems("exchange", box.name, 1);

	return true;
}

function exchangeEmeralds()
{
	if (smart.moving)
	{
		return false;
	}

	let emeralds = character.items[locate_item_greatest_quantity("gem0")];

	if (!emeralds)
	{
		emeralds = character.items[locate_item_greatest_quantity("gem0")];
	}

	if (!emeralds)
	{
		return false;
	}

	writeToLog("Exchanging emeralds...");
	exchangeItems("exchange", emeralds.name, 1);

	return true;
}

function exchangeCandies()
{
	if (smart.moving)
	{
		return false;
	}

	let candies = character.items[locate_item_greatest_quantity("candy1")];

	if (!candies)
	{
		candies = character.items[locate_item_greatest_quantity("candy0")];
	}

	if (!candies)
	{
		return false;
	}

	writeToLog("Exchanging candies...");
	exchangeItems("exchange", candies.name, 1);

	return true;
}

function exchangeSeashells()
{
	if (smart.moving)
	{
		return false;
    }

	let seashells = character.items[locate_item_greatest_quantity("seashell")];

	if (!seashells || seashells.q < 20)
	{
		return false;
	}

	writeToLog("Exchanging seashells...");
	exchangeItems("fisherman", "seashell", 20);

	return true;
}

function exchangeItems(npcName, itemName, minExchange, onComplete)
{
	if (Intervals["Exchange"] != null)
	{
		return false;
    }

	if (!getState("Exchanging"))
	{
		setState("Exchanging");
	}

	Flags["ExchangeItem"] = itemName;

	smart_move(npcName, () =>
	{
		Intervals["Exchange"] = setInterval(() =>
		{
			if (!getState("Exchanging"))
			{
				clearInterval(Intervals["Exchange"]);
				Intervals["Exchange"] = null;
				Flags["ExchangeItem"] = null;
				return;
			}

			if (character.q.exchange)
			{
				return;
            }

			let name = Flags["ExchangeItem"];
			let item = character.items[locate_item_greatest_quantity(name)];

			if (!item || (item && item.q < minExchange) || character.esize < Settings["LowInventory"])
			{
				setState("Idle");
				clearInterval(Intervals["Exchange"]);
				Intervals["Exchange"] = null;
				Flags["ExchangeItem"] = null;

				if (onComplete)
				{
					onComplete();
				}
			}
			else
			{
				exchange(locate_item_greatest_quantity(name));
			}

		}, 1000);
	});
}

function checkMluck(target)
{
	let mLuckDuration = 3600000;
	return (target.s.mluck && target.s.mluck.ms > mLuckDuration * 0.25);
}

async function enterTownMode()
{
	if (character.map !== Settings["HomeMap"])
	{
		travelTo(Settings["HomeMap"], null,() =>
		{
			setState("Town");
		});
	} 
	else
	{
		if (!isInTown())
		{
			use_skill("use_town");
			setTimeout(() =>
			{
				enterTownMode();
			}, 7500);
		} 
		else
		{
			smart_move(Settings["HomeCoords"], () =>
			{
				log("Starting town interval.");
				Intervals["TownInterval"] = setInterval(townInterval, 250);
			});
		}
	}
}

function stopTownInterval()
{
	if (!Intervals["TownInterval"])
	{
		return;
	}

	clearInterval(Intervals["TownInterval"]);
	Intervals["TownInterval"] = null;
}

function deliverPotions(sender, data)
{
	deliverTo(sender, data, ()=>
	{
		if (data.hpots > 0)
		{
			writeToLog("Delivering " + data.hpots + " health potions to " + sender);
			send_item(sender, locate_item("hpot1"), data.hpots);
		}

		if (data.mpots > 0)
		{
			writeToLog("Delivering " + data.mpots + " mana potions to " + sender);
			send_item(sender, locate_item("mpot1"), data.mpots);
		}
	});
}

function deliverElixir(deliverToName, data)
{
	deliverTo(deliverToName, data, ()=>
	{
		writeToLog("Delivering " + data.elixir + " to " + deliverToName);
		send_item(deliverToName, getElixirInventorySlot(data.elixir), 1);
	});
}

function deliverTo(deliverToName, data, deliverFunction)
{
	if (getState("Delivering") || getState("NeedPotions") || is_moving(character) || smart.moving || Intervals["Deliver"] != null)
	{
		return;
	}

	travelTo(data.location.map, data.location.position, () =>
	{
		if (!get_player(deliverToName))
		{
			deliverPotions(deliverToName, data);
			return;
		}

		writeToLog("Delivering to " + deliverToName);
		Flags["DeliverTarget"] = deliverToName;
		setState("Delivering");

		Intervals["Deliver"] = setInterval(() =>
		{
			let target = get_player(deliverToName);

			if (!target || smart.moving)
			{
				return;
			}
			else
			{
				approach(target);
            }

			if (target && distance(character, target) < 200)
			{
				stop();

				deliverFunction();
				
				Flags["DeliverTarget"] = null;
				setState("Delivering", false);
				clearInterval(Intervals["Deliver"]);
				Intervals["Deliver"] = null;
				return;
			}
			else if (!is_moving(character) && !smart.moving && !target)
			{
				stop();
				travelTo(data.location.map, data.location.position);
			}

		}, 1000);
	});
}