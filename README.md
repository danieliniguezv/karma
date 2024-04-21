# Karma

Karma is a decentralized music streaming app that allows musicians to gain control
over their earnings in a way where they are allowed to sell their music to 
listeners.

While the latest reports show that platforms such as Spotify earned a revenue 
of $14.3B being a 50% increment in 4 years with $9.14B.

These number have shocked the artist community as we have seen artists all 
the way from top stars to smaller independent musicians talk about receiving 
“pennies on the dollar”. Having artists such as [Snoop reporting having over a 1B streams while just receiving thousands of dollars in return](https://twitter.com/historyinmemes/status/1766128240467587364).

Music has been around for ages. Understandably, in the past it was quite 
prohibitive for musicians to record, produce, and broadcast themselves as the 
equipments to do so where really expensive. Nowadays to do so has become 
significantly cheap in comparison.

In this way, a **First Music Economy** emerged where artists were lured into 
recording studios that held state of the art equipment for them to play and 
record with, in exchange for the rights of their music and broadcast it for 
free with the promise of getting earnings from shows.

Things have changed. And technology has made so possible, by lowering the costs 
of production equipment and having access to Internet for world wide broadcasting. 
Allowing musicians to produce and broadcast their music by their own means. 
In this way the **Second Music Economy** emerged where musicians where still 
lured into giving their music for free with the promise of giving them access 
to potentially millions of listeners and becoming famous.

While one would like to blame “The Industry”. From this point forward, artists 
are equally to blame if they don’t shift their mindset towards independency. 
We’re on the verge of the Third Music Economy. This wave will allow musicians 
to become truly independent and regain control of their assets. Musicians haven’t 
become fully aware of it but through technology they have been given the 
opportunity to gain complete control of their assets, i.e. their music. They 
can now decide if they want to keep giving out their music for free, or stop.

## Assets

Ever since the rise of blockchain technology artists and developer have become 
interested in exploring the boundaries of what can be done in combining both. 
While mistakenly developers and artists have been wanting to “sell” their 
music as NFTs, this concept is completely wrong.

As we know now NFTs are supposed to be unique assets. Art, such as a painting or 
a sculpture are unique while it’s impossible to obtain two copies, in that way 
they will always be unique. Reproductions of these pieces are available but 
they’re just that: reproductions. The original piece will and always be one.

Music, on the other side, while being too a form of art, it is not unique. 
Music is an intangible asset -invisible if I may- that is usually engraved in 
physical media by means of the technology available at the time, whether it 
was written on paper: musical scores, and reproduced by the buyer who would 
either need to be skilled enough to play the scores or hire a musician to play 
the pieces for them; all the way to metallic plates, vinyl, magnetic tapes, 
acrylic discs (CDs), and finally engraved on silicon plates (transistors) by 
means of electricity, i.e. the digital streaming era. **Music are copies**, 
whether physical or “digital” (while digital and physical remain the same as 
it is being stored inside electronic chips); i.e. **Music is a Fungible Asset** 
and not the opposite. 

The song that I’m listening to at this exact moment might be the same song 
somebody is listening in Tokyo perhaps. If we were to exchange our **copies** 
with one another we would end up with the same intangible asset, i.e. the same 
song. In this way we now know that music holds the same principle that money 
does: to hold the an interchangeable intangible value as long as the physical 
media responsible to hold the idea of it remains on a functional shape, good 
enough to still be able to recognize it and draw its value out of it, being so 
then a fungible asset.

This is how we know then, that platforms such as Spotify must be seen and 
understood as banks offering little to no returns for musicians and artists 
who deposit their assets with them.

## Permits and The Third Music Economy

The principle is simple enough. As we know now that music is a fungible asset, 
then it must be treated as such -to some extent we have treated as such, 
unknowingly in the past- .

What are given, on behalf of the artists, whether it was a CD, a Cassette, 
a Download or a Stream is permission to listen to the songs. While we might 
hold a physical copy of the music, the idea behind is that we are buying a 
lifetime permit to listen to the musical piece as long as it serves only for 
recreational purposes with no commercial intended purposes -similarly as with 
money we are granted the possibility to hold it for a lifetime and we can store 
or us it as we will as long as it is not used for regulated endeavors or 
dubious activities.

While these commercial rights or permits, might be available too, that permit 
is another in itself that might entail another set of rules such as royalties, 
i.e. a perpetual revenue flowing back to the artist, creating in this way a 
symbiotic relationship between the listener -or user- and the musician.

So in this way I introduce `permits`  as the premise for artists to interact 
with listeners and users in the **Third Music Economy**. 

Permits are what the musicians will  be selling. These permits will be easily 
traced back to the song via a simple enough data structure of a mapping on a 
smart contract in which they will be related by means of an acoustical fingerprint.

With this shift in the paradigm of how music is seen and understood now, as 
being an interchangeable asset (fungible), the possibilities of a Decentralized 
Financial solution (DeFi) opens up to be explored.

In this way we must then think of permits and relate them to the `approval of 
spending` and such other notions that we have been introduced to.

## Acoustical Fingerprint

To trace back and associate songs in a unique way this is being done via 
obtaining an acoustical fingerprint via `fpcal` which then is hashed via 
a `keccak256` hashing function that it is then stored in the smart contract. 

This acoustic fingerprint is the foundational layer of this economy. It is a 
unique way to identify an invisible asset such as music.

## Technology

The technology used in this project:

- Solidity
- Foundry
- EthersJS
- JavaScript
- Node JS
- Express
- HTML5
- CSS3
- SQL
- MySQL

## Prerequisites

For this dapp to work, although most of the needed dependencies and software 
will be installed when starting the project as mentioned ahead. You will need 
to create and install a database. For this particular project SQL and MySQL 
are being utilized and here is a great [video](https://youtu.be/HXV3zeQKqGY?si=IZb88uvfayRL2Y9_) that will guide you 
perfectly on how to install an run a MySQL instance server on your machine.

## How to Install

Clone this repository and `cd` into the project’s directory. Once on the root 
of the project’s directory run:

```sh
karma ~ npm install
```

You will need to create two environmental variables. One on the root of 
the `backend` directory:

```sh
karma/backend ~ vim .env
```

inside create the password for your database as such:

```sh
DB_PASSWORD='your_password'
```

Before creating the environment variable for the frontend, head over to [Remix](https://remix.ethereum.org/#lang=en&optimize=false) (for 
the ease of it) or your preferred method to deploy your contract. You can also 
use [foundry](https://book.getfoundry.sh/tutorials/solidity-scripting#deploying-our-contract) and deploy and verify the contract.

Now head over to the root of `frontend` directory:

```sh
karma/frontend ~ vim .env
```

inside input the address for your deployed smart contract

```sh
SONGS_SMART_CONTRACT_ADDRESS='0x...'
```

Finally run and build the project standing on the root level of the project’s 
directory and head over on your browser to `[localhost:3000/login.html](http://localhost:3000/login.html)` . Run:

```sh
karma ~ npm run dev
```
