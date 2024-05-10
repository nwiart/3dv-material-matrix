import requests

API_KEY = "c9a69a38-ff63-4d5e-b143-ec53fab02424.NqF6448Da_dXPz2AN0GI3YkIwUdPUS9Rjxqd-0r2XDY"


# Register User
def registerUser(name):
	url = "https://api.3dverse.com/app/v1/users"
	r = requests.post(url, headers={'api_key': API_KEY}, data={"username":name})
	return r.json()

# Generate User
def generateUser(user_id):
	url = f"https://api.3dverse.com/app/v1/users/{user_id}/tokens"
	r = requests.post(url, headers={'api_key': API_KEY}, data={"scope":"manage", "ttl": "24h"})
	return r.json()

# Grant Access
def grantUserAccess(user_id, folder_id):
	member_type = "users"
	member_id = user_id
	url = f"https://api.3dverse.com/app/v1/folders/{folder_id}/access/{member_type}/{member_id}"
	requests.put(url, headers={'api_key': API_KEY}, data={"access":"write"})

# Delete User
def deleteUser(user_id):
	url = f"https://api.3dverse.com/app/v1/users/{user_id}"
	r = requests.del(url, headers={'api_key': API_KEY})
	return r.json()


response = registerUser("testuser")
user_id = response["user_id"]

response = generateUser(user_id)
user_token = response["user_token"]

grantUserAccess(user_id, ???)





# Create empty scene.
def createAsset(folder_id, asset_type, asset_name):
	url = "https://api.3dverse.com/app/v1/folders"
	r = requests.post(url, headers={'api_key': API_KEY}, data={"asset_type": asset_type, "name": asset_name})
	return r.json()

def listFolders():
	r = requests.post("https://api.3dverse.com/app/v1/folders", headers={'api_key': API_KEY}, data={""})
	return r.json()
