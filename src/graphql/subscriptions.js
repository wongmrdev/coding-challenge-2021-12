/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCreator = /* GraphQL */ `
  subscription OnCreateCreator {
    onCreateCreator {
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
export const onUpdateCreator = /* GraphQL */ `
  subscription OnUpdateCreator {
    onUpdateCreator {
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
export const onDeleteCreator = /* GraphQL */ `
  subscription OnDeleteCreator {
    onDeleteCreator {
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
export const onCreateDnaSequence = /* GraphQL */ `
  subscription OnCreateDnaSequence {
    onCreateDnaSequence {
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
export const onUpdateDnaSequence = /* GraphQL */ `
  subscription OnUpdateDnaSequence {
    onUpdateDnaSequence {
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
export const onDeleteDnaSequence = /* GraphQL */ `
  subscription OnDeleteDnaSequence {
    onDeleteDnaSequence {
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
