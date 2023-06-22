export const getGroups = (boardId) =>
`
  query {
    boards (ids: ${boardId}}) {
      groups {
        title
      }
    }
  }
`

export const getAll = (boardId) =>
`
  query {
    boards (ids: ${boardId}) {
      id
      items {
        id
        name
        column_values {
        	id
          title
        	value
      	}
      }
    }
  }
`

export const getColumns = (boardId) =>
`
  query {
    boards (ids: ${boardId}) {
      name
      id
      columns {
        id
        type
        title
      }
    }
  }
`