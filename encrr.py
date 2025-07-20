import random
import string
chars= " " + string.punctuation + string.digits + string.ascii_letters
chars = list(chars)
key= chars.copy()

random.shuffle(key)

 
email=input(f"Enter email:")

pword=input(f"Enter password")

cword=input(f"Confirm Password")

def user_confirm(email,pword,cword):
    SpecialSym=['!','@', '#','%','$']   
    val=True 

if len(pword)<8:
    print('Password should not be more than 9')
    val=False
if len(pword)>4:
    print('Password is too short')

if cword==pword:
    print("Password is clear")
else:
    print("Passwords do not match.Try Again")
    
    #password requirements
if not any(char.isdigit() for char in cword):
    print('Password should have atleast one number')
    
if not any(char.isuppercase() for char in cword):
    print('Password should have atleast one Uppercase')

if not any(char.islower() for char in cword):
    print('Password should have atleast one number')

if not any(char in SpecialSym for char in cword):
    print('Password should have atleast one Special caracter')
