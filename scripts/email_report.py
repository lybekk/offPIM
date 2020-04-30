import os
import random
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime
from string import Template
import requests

"""
WORK IN PROGRESS
This script sends an email report of tasks due today and overdue
"""

###########################
# SETTINGS - Modify these #
###########################
EMAIL_HOST =        "smtp.gmail.com"
EMAIL_PORT =        465
SENDER_EMAIL =      "sender@example.com"
RECEIVER_EMAIL =    "receiver@example.com"
EMAIL_PASSWORD =    "superSecretPasswordForSendersEmailAccount"
MANGO_URL =         "http://localhost:5984/vault/_find" # if authentication needed-> http://username:password@localhost:5984/vault/_find

THEME = "random"
# Theme - If unpredictability isn't your thing, replace random with one of the themes below
    # normal
    # cyber
    # cyber_lowkey
    # cyber_renaissance
PRINT_TO_CONSOLE = True # set to False to skip printing to console/terminal

#########################################
# Not necessary to do any changes below #
#########################################

themes = {
    "normal": {
        "bg": "transparent",
        "bg_secondary": "transparent",
        "fg": "#000000",
        "font": "'Times New Roman', Times, serif"
    },
    "cyber": {
        "bg": "#1f2833",
        "bg_secondary": "#1f2833",
        "fg": "#66fcf1",
        "font": "monospace"
    },
    "cyber_lowkey": {
        "bg": "#0b0c10",
        "bg_secondary": "#0b0c10",
        "fg": "#45a29e",
        "font": "Arial, Helvetica, sans-serif"
    },
    "cyber_renaissance": {
        "bg": "#977334",
        "bg_secondary": "#edd578",
        "fg": "#000000",
        "font": "'Courier New', Courier, monospace"
    }
}

if THEME == "random":
    THEME = random.choice( list(themes.keys()) )

message = MIMEMultipart("alternative")
message["Subject"] = "offPIM report"
message["From"] = SENDER_EMAIL
message["To"] = RECEIVER_EMAIL

# Get tasks today and overdue
date_tomorrow_object = datetime.date.today() + datetime.timedelta(days=1)
date_tomorrow = date_tomorrow_object.strftime("%Y-%m-%d")
mango = {
    "selector": {
        "productivity": True,
        "type": "task",
        "$nor": [
            {"status": "cancelled"},
            {"status": "done"}
        ]
    },
    "limit": 1000,
    "use_index": "offpim_mango_indexes"
}

url = MANGO_URL
r = requests.post(url = url, json = mango)
j = r.json()

lists = {
    "text": {
        "todayandoverdue":[],
        "doing":[],
        "next":[]
    },
    "html": {
        "todayandoverdue":[],
        "doing":[],
        "next":[]
    },
    "print": {
        "todayandoverdue":[],
        "doing":[],
        "next":[]
    }
}
for doc in j["docs"]:
    if "due" in doc:
        dd = doc["due"]
        if dd != None and dd < date_tomorrow:
            lists["text"]["todayandoverdue"].append(
                f'+ {doc["title"]}\n'
            )
            lists["html"]["todayandoverdue"].append(
                f'<li>{doc["title"]}</li>'
            )
            lists["print"]["todayandoverdue"].append(
                f'+ {doc["title"]}'
            )
    for s in ["doing","next"]:
        if doc["status"] == s:
            lists["text"][s].append(
                f'+ {doc["title"]}\n'
            )
            lists["html"][s].append(
                f'<li>{doc["title"]}</li>'
            )
            lists["print"][s].append(
                f'+ {doc["title"]}'
            )

# Create the plain-text and HTML version of your message
title = "offPIM Report"
tto = "Tasks today and overdue"
tip = "Tasks in progress (status - doing)"
tna = "Tasks next action (status - next)"

l_tto = lists["text"]["todayandoverdue"]
text = f'''
{ title }
{ len(title) * "=" }
{len( l_tto )} { tto }
{ ( len( str( len(l_tto) ) ) + len( tto ) ) * "-"}
{ ''.join( l_tto )}
{ 34*"-" }
{ tip }
{ 34*"-" }
{ ''.join( lists["text"]["doing"] )}
{ 33*"-" }
{ tna }
{ 33*"-" }
{ ''.join( lists["text"]["next"] )}
{ 42*"-" }
* View in HTML for richer formatting
'''

l_tto = lists["html"]["todayandoverdue"]
l_tip = lists["html"]["doing"]
l_tna = lists["html"]["next"]
style_bg = f'style="background-color: {themes[THEME]["bg_secondary"]}; display: inline;"'
html = f'''
<html>
  <body style="background-color: {themes[THEME]["bg"]}; color: {themes[THEME]["fg"]}; font-family: {themes[THEME]["font"]};">
    <h1 {style_bg}>
        { title }
    </h1>
    <hr style="border-color: {themes[THEME]["bg_secondary"]};">
    <h2 {style_bg}>
        Tasks
    </h2>
    <br>
    <h3 {style_bg}>
        {len( l_tto )} { tto }
    </h3>
    <ul style="background-color: {themes[THEME]["bg_secondary"]};">
        {''.join( l_tto )}
    </ul>
    <h3 {style_bg}>
        {len( l_tip )} { tip }
    </h3>
    <ul style="background-color: {themes[THEME]["bg_secondary"]};">
        {''.join( l_tip )}
    </ul>
    <h3 {style_bg}>
        {len( l_tna )} { tna }
    </h3>
    <ul style="background-color: {themes[THEME]["bg_secondary"]};">
        {''.join( l_tna )}
    </ul>
  </body>
</html>
'''

# Turn these into plain/html MIMEText objects
part1 = MIMEText(text, "plain")
part2 = MIMEText(html, "html")

# Add HTML/plain-text parts to MIMEMultipart message
# The email client will try to render the last part first
message.attach(part1)
message.attach(part2)

# Create secure connection with server and send email
context = ssl.create_default_context()
with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, context=context) as server:
    server.login(SENDER_EMAIL, EMAIL_PASSWORD)
    server.sendmail(
        SENDER_EMAIL, 
        RECEIVER_EMAIL, 
        message.as_string()
    )

if PRINT_TO_CONSOLE:
    print(text)
