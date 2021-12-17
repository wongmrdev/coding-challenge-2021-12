/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCreator = /* GraphQL */ `
  query GetCreator($id: String!) {
    getCreator(id: $id) {
      id
      name
      handle
      DnaSequence {
        items {
          id
          bases
          name
          createdAt
          updatedAt
          creatorDnaSequenceId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listCreators = /* GraphQL */ `
  query ListCreators(
    $id: String
    $filter: ModelCreatorFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCreators(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        handle
        DnaSequence {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDnaSequence = /* GraphQL */ `
  query GetDnaSequence($id: String!) {
    getDnaSequence(id: $id) {
      id
      bases
      name
      createdAt
      creator {
        id
        name
        handle
        DnaSequence {
          nextToken
        }
        createdAt
        updatedAt
      }
      updatedAt
      creatorDnaSequenceId
    }
  }
`;
export const listDnaSequences = /* GraphQL */ `
  query ListDnaSequences(
    $id: String
    $filter: ModelDnaSequenceFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listDnaSequences(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        bases
        name
        createdAt
        creator {
          id
          name
          handle
          createdAt
          updatedAt
        }
        updatedAt
        creatorDnaSequenceId
      }
      nextToken
    }
  }
`;
