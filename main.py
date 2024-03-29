#!/usr/bin/python3
import os
import discord
import bot
import math
import random
import sqlite3
import discord.utils
from discord.ext import commands, tasks

conn = sqlite3.connect('db/leaderboard.db')
cursor = conn.cursor()

token = os.getenv("DISCORD_TOKEN")
my_guild = os.getenv("DISCORD_GUILD")

intents = discord.Intents.default()
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    for guild in client.guilds:
        if guild.name == my_guild:
            break

        print(
            f"{client.user} is connected to the following guild:\n"
            f"{guild.name}(id: {guild.id})"
        )

@client.event
async def on_message(message):
    if message.author == client.user:
        return
    message = await message.channel.fetch_message(message.id)
    print(f"Received message: {message.content}")  # Debugging message
    message_content = message.content.lower()
    parts = message_content.split()

    #### HELP FUNCTION ##########################################################################
    if message_content == "!help":
        embed = discord.Embed(title="Commandes Epilift", description="Voici la liste de commandes pour le bot Epilift:")
        embed.add_field(name=f"!classement", value=f"affiche le classement", inline=False)
        embed.add_field(name=f"!roll (chiffre)", value=f"donne un chiffre aléatoire entre 0 et le chiffre donné", inline=False)
        await message.channel.send(embed=embed)
    #### ROLL FUNCTION ############################################################################
    if parts[0] == "!roll":
        try:
            rand = random.randint(0, int(parts[1]))
            await message.channel.send(rand)
        except (IndexError, ValueError):
            await message.channel.send("Un chiffre est nécessaire.")

    #### LEADERBOARD SHOW FUNCTION #################################################################
    if message_content == "!classement":
        cursor.execute("SELECT name, squat, bench, deadlift, sbd FROM sbd ORDER BY sbd DESC")
        results = cursor.fetchall()
        embed = discord.Embed(title="Classement Epilift", description="Voici le classement Epilift", color=0xffd700)
        for index, result in enumerate(results, start=1):
            name, squat, bench, deadlift, sbd = result
            value = f"Prenom: {name}, Squat: {squat}kg, Bench: {bench}kg, Deadlift: {deadlift}kg, Sbd: {round(sbd, 2)}kg"
            embed.add_field(name=f"{index}st Place", value=value, inline=False) 
        embed.set_footer(text="Merci de DM lorisdxb pour etre mis sur le classement! :)")
        await message.channel.send(embed=embed)
     #### LEADERBOARD SQUAT SHOW FUNCTION #################################################################
    if parts[0] == "!classement" and parts[1] == "squat":
        try:
            cursor.execute("SELECT name, squat FROM sbd ORDER BY squat DESC")
            results = cursor.fetchall()
            embed = discord.Embed(title="Classement squat Epilift", description="Voici le classement Squat Epilift", color=0xffd700)
            for index, result in enumerate(results, start=1):
                name, squat = result
                value = f"Prenom: {name}, Squat: {squat}kg"
                embed.add_field(name=f"{index}st Place", value=value, inline=False)
            embed.set_footer(text="Merci de DM lorisdxb pour etre mis sur le classement! :)")
            await message.channel.send(embed=embed)
        except(IndexError, ValueError):
            await message.channel.send("Erreur")
    ##### LEADERBOARD BENCH SHOW FUNCTION ###############################################################
    if parts[0] == "!classement" and parts[1] == "bench":
        try:
            cursor.execute("SELECT name, bench FROM sbd ORDER BY bench DESC")
            results = cursor.fetchall()
            embed = discord.Embed(title="Classement bench Epilift", description="Voici le classement Bench Epilift", color=0xffd700)
            for index, result in enumerate(results, start=1):
                name, bench = result
                value = f"Prenom: {name}, Bench: {bench}kg"
                embed.add_field(name=f"{index}st Place", value=value, inline=False)
            embed.set_footer(text="Merci de DM lorisdxb pour etre mis sur le classement! :)")
            await message.channel.send(embed=embed)
        except(IndexError, ValueError):
            await message.channel.send("Erreur")
    ### LEADERBOARD DEADLIFT SHOW FUNCTION ###############################################
    if parts[0] == "!classement" and parts[1] == "deadlift":
        try:
            cursor.execute("SELECT name, deadlift FROM sbd ORDER BY deadlift DESC")
            results = cursor.fetchall()
            embed = discord.Embed(title="Classement deadlift Epilift", description="Voici le classement Deadlift Epilift", color=0xffd700)
            for index, result in enumerate(results, start=1):
                name, deadlift = result
                value = f"Prenom: {name}, Deadlift: {deadlift}kg"
                embed.add_field(name=f"{index}st Place", value=value, inline=False)
            embed.set_footer(text="Merci de DM lorisdxb pour etre mis sur le classement! :)")
            await message.channel.send(embed=embed)
        except(IndexError, ValueError):
            await message.channel.send("Erreur")
    #### LEADERBOARD ADD FUNCTION ###################################################################
    required_role = message.guild.get_role(1204824665638436955) #get organisateur role
    member = await message.guild.fetch_member(message.author.id) #get member id

    if parts[0] == "!classement" and parts[1] == "add":
        if required_role in member.roles: #verif si le sender a le role
            try:
                cursor.execute("SELECT * FROM sbd WHERE name = ?", (parts[2],))
                result = cursor.fetchone()
                if result:
                    cursor.execute("UPDATE sbd SET squat = ?, bench = ?, deadlift = ?, sbd = ? WHERE name = ?", (parts[3], parts[4], parts[5], (int(parts[3]) + int(parts[4]) + int(parts[5])) / 3, parts[2]))
                    cursor.execute("UPDATE lookup SET squatvid = ?, benchvid = ?, deadliftvid = ? WHERE name = ?", (parts[6], parts[7], parts[8], parts[2]))
                    await message.channel.send(f"L'utilisateur {parts[2]} a été mis à jour avec succès !")
                else:
                    cursor.execute("INSERT INTO sbd (name, squat, bench, deadlift) VALUES (?, ?, ?, ?)", (str(parts[2]), parts[3], parts[4], parts[5]))
                    cursor.execute("INSERT INTO lookup (name, squatvid, benchvid, deadliftvid) VALUES (?, ?, ?, ?)", (str(parts[2]), parts[6], parts[7], parts[8]))
                    await message.channel.send(f"L'utilisateur {parts[2]} a été ajouté au classement avec succès !")
                conn.commit()
            except (IndexError, ValueError):
                await message.channel.send("Pas assez d'arguments, 4 arguments nécessaire")
        else:
            await message.channel.send("Vous n'avez pas les permissions.")
    #### LEADERBOARD REMOVE FUNCTION ###############################################################
    if parts[0] == "!classement" and parts[1] == "del":
        if required_role in member.roles: #verif si le sender a le role
            try:
                cursor.execute("SELECT * FROM sbd WHERE name = ?", (parts[2],))
                result = cursor.fetchone()
                if result:
                    cursor.execute("DELETE FROM sbd WHERE name = ?", (parts[2],))
                    conn.commit()
                    await message.channel.send(f"L'utilisateur {parts[2]} a était supprimé du classement avec succès!")
                else:
                    await message.channel.send(f"L'utilisateur {parts[2]} n'est pas présent dans le classement.")
            except (IndexError, ValueError):
                await message.channel.send("Pas assez d'arguments, 4 arguments nécessaire")
        else:
            await message.channel.send("Vous n'avez pas les permissions.")
    ####  LOOKUP FUNCTION ####################
    if parts[0] == "!lookup":
        print("lookup!");
        try:
            cursor.execute("SELECT lookup.name, lookup.squatvid, lookup.benchvid, lookup.deadliftvid, sbd.squat, sbd.bench, sbd.deadlift FROM lookup JOIN sbd ON lookup.name = sbd.name WHERE lookup.name = ?", (parts[1],))
            results = cursor.fetchone()
            if results:
                name = results[0]
                squatvid = results[1]
                benchvid = results[2]
                deadliftvid = results[3]
                squat = results[4]
                bench = results[5]
                deadlift = results[6]
                embed = discord.Embed(title="Lookup", description="Voici les statistiques de cette personne:", color=0xffd700)
                value = f"Prenom: {name},\n Squat: {squatvid} {squat}kg,\n Bench: {benchvid} {bench}kg,\n Deadlift: {deadliftvid} {deadlift}kg"
                embed.add_field(name=f"Utilisateur:", value=value, inline=False)
                embed.set_footer(text="Merci de DM lorisdxb si vous trouvez un bug! :)")
                await message.channel.send(embed=embed)
            else:
                await message.channel.send("Aucun résultat trouvé.")
        except (IndexError, ValueError):
            await message.channel.send("Erreur lors de l'exécution de la requête.")

client.run('ADDTOKENHERE')
