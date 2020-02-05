### Code to collect the ids of random youtube videos and storing them.

import json
import urllib.request
import string
import random

API_KEY = "YOUR_API_KEY_HERE"

### JS file to store the ids in a JSON Object 
jsonSaveFile = "./rnd_ids.js"
count = 50

### .txt file to temporarily store ids
saveFileForIDs = "./rndIds2.txt"

try:
    ### generate a random search key
    random = "".join(random.choice(string.ascii_uppercase + string.digits) for _ in range(3))

    ### use youtube API to search for videos matching the searchkey
    urlData = "https://www.googleapis.com/youtube/v3/search?key={}&maxResults={}&part=snippet&type=video&q={}".format(API_KEY,count,random)
    webURL = urllib.request.urlopen(urlData)
    data = webURL.read()

    encoding = webURL.info().get_content_charset('utf-8')
    results = json.loads(data.decode(encoding))

    data = results['items']
    
    ### get a list of ids that were extracted before
    with open(saveFileForIDs, "r") as f:
        prevIds = f.read().split(";")
    
    ### add new ids to the list
    for d in data:
        videoId = d['id']['videoId']
        prevIds.append(videoId)
    
    ### Converting to a set removes duplicate ids from the list
    prevIds = set(prevIds)
    
    ### construct saveString for saving the ids to .txt file
    idString = ";".join(prevIds)
    with open(saveFileForIDs, "w") as f:
        f.write(idString)
    
    ### Save ids as JSON object in JS file for React to read them 
    with open(saveFileForIDs, "r") as f:
        ids = f.read()[:-1].split(";")
        jsonObj = {"ids": ids}
        jsonStr = json.dumps(jsonObj)
        saveText = "const rndIds_json = {};\nexport default rndIds_json".format(jsonStr)
        with open(jsonSaveFile, "w") as outfile:
            outfile.write(saveText)


except Exception:
    ### e.g. when quota of API calls is exceeded
    raise Exception
    print("Error while scraping...")