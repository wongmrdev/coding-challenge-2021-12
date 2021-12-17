/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCreator = /* GraphQL */ `
  mutation CreateCreator(
    $input: CreateCreatorInput!
    $condition: ModelCreatorConditionInput
  ) {
    createCreator(input: $input, condition: $condition) {
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
export const updateCreator = /* GraphQL */ `
  mutation UpdateCreator(
    $input: UpdateCreatorInput!
    $condition: ModelCreatorConditionInput
  ) {
    updateCreator(input: $input, condition: $condition) {
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
export const deleteCreator = /* GraphQL */ `
  mutation DeleteCreator(
    $input: DeleteCreatorInput!
    $condition: ModelCreatorConditionInput
  ) {
    deleteCreator(input: $input, condition: $condition) {
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
export const createDnaSequence = /* GraphQL */ `
  mutation CreateDnaSequence(
    $input: CreateDnaSequenceInput!
    $condition: ModelDnaSequenceConditionInput
  ) {
    createDnaSequence(input: $input, condition: $condition) {
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
export const updateDnaSequence = /* GraphQL */ `
  mutation UpdateDnaSequence(
    $input: UpdateDnaSequenceInput!
    $condition: ModelDnaSequenceConditionInput
  ) {
    updateDnaSequence(input: $input, condition: $condition) {
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
export const deleteDnaSequence = /* GraphQL */ `
  mutation DeleteDnaSequence(
    $input: DeleteDnaSequenceInput!
    $condition: ModelDnaSequenceConditionInput
  ) {
    deleteDnaSequence(input: $input, condition: $condition) {
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
