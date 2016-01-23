# WADE Project - Semantic Web notes

`Work in progress`

## Virtuoso RDF Store Installation

Latest builds seem to fail on MAC/Windows. Use docker installation from [here](https://github.com/tenforce/docker-virtuoso) instead.

On MAC/Windows default endpoint for *POST* requests with `Content-Type: application/sparql-query` should be `http://192.168.99.100:8890/DAV`. The response format can be changed using the `Accept` header in the request, it can be `Accept: application/json`.

## DBpedia

Testing SPARQL queries can be done [here](http://dbpedia.org/sparql). DBpedia also uses Virtuoso for the RDF store and has a number of preloaded namespaces which can be found [here](http://dbpedia.org/sparql?nsdecl).

### Tested queries

#### Getting all music genres
There seems to be an issue with `dbo:MusicGenre`. Some resources are mislabeled, [example](http://dbpedia.org/page/X_window_manager).
```
select distinct ?genre where {
    ?genre a dbo:MusicGenre.
    filter(regex(?genre, "_music$", "i"))
}
```

#### Getting the URI of an Artist from DBpedia
This is to be used in order to set the appropriate URI in our User Store. Replace the string to match with the string gathered from APIs.
```
select distinct ?person where {
    ?person dbp:name ?name;
            rdf:type dbo:MusicalArtist.
    filter(regex(?name, "robbie williams", "i"))
} limit 1
```

#### Getting the URI of an Album from DBpedia
This is to be used in order to set the appropriate URI in our User Store. Replace the string to match with the string gathered from APIs. Two different artists can release two different albums with the same name so it would be recommended that the `dbp:artist` verb point to a DBpedia resource describing the specific artist.
```
select distinct ?album where {
    ?album dbp:name ?name;
            rdf:type dbo:Album;
            rdf:type dbo:MusicalWork;
            dbp:artist <http://dbpedia.org/resource/Robbie_Williams>
    filter(regex(?name, "And Through It All", "i"))
} limit 1
```

#### Getting the URI of a Song from DBpedia
This is to be used in order to set the appropriate URI in our User Store. Replace the string to match with the string gathered from APIs. Two different artists can release two different songs with the same name so it would be recommended that the `dbp:artist` verb point to a DBpedia resource describing the specific artist. Two different albums can also contain the same song so it would be recommended that the album be specified also.
```
select distinct ?song where {
    ?song dbp:name ?name;
            rdf:type dbo:Single;
            rdf:type dbo:MusicalWork;
            dbp:artist <http://dbpedia.org/resource/Robbie_Williams>
    filter(regex(?name, "Let Me Entertain You", "i"))
} limit 1
```

#### Getting the associated Bands for a specific artist
```
select ?bands where {
   ?bands dbo:associatedBand <http://dbpedia.org/resource/Robbie_Williams>.
}
```

#### Getting songs that artists have in common
```
select ?song where {
     ?song dbo:musicalArtist <http://dbpedia.org/resource/Robbie_Williams>;
           dbo:musicalArtist <http://dbpedia.org/resource/Gary_Barlow>.
}
```

#### Getting songs from an artist that are from a specific genre
```
select distinct ?song where {
    ?song dbp:name ?name;
            rdf:type dbo:Single;
            rdf:type dbo:MusicalWork;
            dbp:artist <http://dbpedia.org/resource/Robbie_Williams>;
            dbo:genre <http://dbpedia.org/resource/Pop_rock>.
}
```

