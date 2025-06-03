import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypesFromSanity from 'all:part:@sanity/base/schema-type'
import {schemaTypes} from './schemaTypes'

export default createSchema({
  name: 'default',
  types: schemaTypesFromSanity.concat(schemaTypes),
})
