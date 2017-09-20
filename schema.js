const fetch = require('node-fetch')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql')

const a = 0

const { makeFlatFetchTableToJson } = require('./fetchTable')
const flatFetchTableToJson = makeFlatFetchTableToJson(fetch)

const FilmType = new GraphQLObjectType({
    name: 'Film',
    description: 'awesome movie',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: filmJson => filmJson.title
        },
        characters: {
            type: new GraphQLList(PeopleType),
            resolve: filmJson => flatFetchTableToJson(filmJson.characters)
        },
        planets: {
            type: new GraphQLList(PlanetType),
            resolve: filmJson => flatFetchTableToJson(filmJson.planets)
        }
    })
})


const PeopleType = new GraphQLObjectType({
    name: 'People',
    description: 'some1 from SW',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: peopleJson => peopleJson.name
        },
        films: {
            type: new GraphQLList(FilmType),
            resolve: peopleJson =>
                flatFetchTableToJson(peopleJson.films)
        }
    })
})


const PlanetType = new GraphQLObjectType({
    name: 'Planet',
    description: 'planet from SW',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: planetJson => planetJson.name
        },
        residents: {
            type: new GraphQLList(PeopleType),
            resolve: planetJson =>
                flatFetchTableToJson(planetJson.residents)
        }
    })
})


module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            planet: {
                type: PlanetType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) =>
                    fetch(`https://swapi.co/api/planets/${args.id}`)
                    .then(response => response.json())
            },
            people: {
                type: PeopleType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) =>
                    fetch(`https://swapi.co/api/people/${args.id}`)
                    .then(response => response.json())
            },
            film: {
                type: FilmType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) =>
                    fetch(`https://swapi.co/api/films/${args.id}`)
                    .then(response => response.json())
            }
        })
    })
})