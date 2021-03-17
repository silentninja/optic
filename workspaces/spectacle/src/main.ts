import { makeSpectacle } from './index';
import * as DiffEngine from '@useoptic/diff-engine-wasm/engine/build';

const _events = [
  {
    "BatchCommitStarted": {
      "batchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
      "commitMessage": "initial spec",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.656Z"
      }
    }
  },
  {
    "PathComponentAdded": {
      "pathId": "path_9Wdr4kyshW",
      "parentPathId": "root",
      "name": "posts",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.662Z"
      }
    }
  },
  {
    "PathComponentAdded": {
      "pathId": "path_8paa69fCfC",
      "parentPathId": "root",
      "name": "comments",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.663Z"
      }
    }
  },
  {
    "PathComponentAdded": {
      "pathId": "path_osi3pD8diw",
      "parentPathId": "root",
      "name": "profile",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.664Z"
      }
    }
  },
  {
    "RequestParameterAddedByPathAndMethod": {
      "parameterId": "request-parameter_YTF5vLYlls",
      "pathId": "path_9Wdr4kyshW",
      "httpMethod": "GET",
      "parameterLocation": "query",
      "name": "queryString",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.664Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_1T8ZANWIcd",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.664Z"
      }
    }
  },
  {
    "RequestParameterShapeSet": {
      "parameterId": "request-parameter_YTF5vLYlls",
      "parameterDescriptor": {
        "shapeId": "shape_1T8ZANWIcd",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.664Z"
      }
    }
  },
  {
    "RequestAdded": {
      "requestId": "request_w0KmJ5kZIe",
      "pathId": "path_9Wdr4kyshW",
      "httpMethod": "GET",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.664Z"
      }
    }
  },
  {
    "ResponseAddedByPathAndMethod": {
      "responseId": "response_iQd5ISIZH9",
      "pathId": "path_9Wdr4kyshW",
      "httpMethod": "GET",
      "httpStatusCode": 200,
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.669Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_j1aiWREIbU",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.671Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_JH0cqjvNSd",
      "baseShapeId": "$string",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.671Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_OCXyZL2Lyp",
      "shapeId": "shape_j1aiWREIbU",
      "name": "author",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_OCXyZL2Lyp",
          "shapeId": "shape_JH0cqjvNSd"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.671Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_hnfXS9Vmns",
      "baseShapeId": "$number",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.672Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_CXHgTtjIPq",
      "shapeId": "shape_j1aiWREIbU",
      "name": "id",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_CXHgTtjIPq",
          "shapeId": "shape_hnfXS9Vmns"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.672Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_FIaVxhxPUW",
      "baseShapeId": "$string",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.673Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_pb75z9dypc",
      "shapeId": "shape_j1aiWREIbU",
      "name": "title",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_pb75z9dypc",
          "shapeId": "shape_FIaVxhxPUW"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.673Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_E9IzHThmZv",
      "baseShapeId": "$list",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.673Z"
      }
    }
  },
  {
    "ShapeParameterShapeSet": {
      "shapeDescriptor": {
        "ProviderInShape": {
          "shapeId": "shape_E9IzHThmZv",
          "providerDescriptor": {
            "ShapeProvider": {
              "shapeId": "shape_j1aiWREIbU"
            }
          },
          "consumingParameterId": "$listItem"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.674Z"
      }
    }
  },
  {
    "ResponseBodySet": {
      "responseId": "response_iQd5ISIZH9",
      "bodyDescriptor": {
        "httpContentType": "application/json",
        "shapeId": "shape_E9IzHThmZv",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.674Z"
      }
    }
  },
  {
    "RequestParameterAddedByPathAndMethod": {
      "parameterId": "request-parameter_dgmp5nlVrH",
      "pathId": "path_8paa69fCfC",
      "httpMethod": "GET",
      "parameterLocation": "query",
      "name": "queryString",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.674Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_9t5hqnMMma",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.674Z"
      }
    }
  },
  {
    "RequestParameterShapeSet": {
      "parameterId": "request-parameter_dgmp5nlVrH",
      "parameterDescriptor": {
        "shapeId": "shape_9t5hqnMMma",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.674Z"
      }
    }
  },
  {
    "RequestAdded": {
      "requestId": "request_CEJzcYN3NN",
      "pathId": "path_8paa69fCfC",
      "httpMethod": "GET",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.674Z"
      }
    }
  },
  {
    "ResponseAddedByPathAndMethod": {
      "responseId": "response_ata4rM8zB1",
      "pathId": "path_8paa69fCfC",
      "httpMethod": "GET",
      "httpStatusCode": 200,
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.675Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_ZVgfHusbJW",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.675Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_6dDj0Z3HkT",
      "baseShapeId": "$string",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.675Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_tZbQYoQmxt",
      "shapeId": "shape_ZVgfHusbJW",
      "name": "body",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_tZbQYoQmxt",
          "shapeId": "shape_6dDj0Z3HkT"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.675Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_If49etudqF",
      "baseShapeId": "$number",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.676Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_UMhLN288Z3",
      "shapeId": "shape_ZVgfHusbJW",
      "name": "id",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_UMhLN288Z3",
          "shapeId": "shape_If49etudqF"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.676Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_VXfig63hnr",
      "baseShapeId": "$number",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.676Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_VMgg5gTvnO",
      "shapeId": "shape_ZVgfHusbJW",
      "name": "postId",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_VMgg5gTvnO",
          "shapeId": "shape_VXfig63hnr"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.676Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_UlLNexyAzZ",
      "baseShapeId": "$list",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.677Z"
      }
    }
  },
  {
    "ShapeParameterShapeSet": {
      "shapeDescriptor": {
        "ProviderInShape": {
          "shapeId": "shape_UlLNexyAzZ",
          "providerDescriptor": {
            "ShapeProvider": {
              "shapeId": "shape_ZVgfHusbJW"
            }
          },
          "consumingParameterId": "$listItem"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.677Z"
      }
    }
  },
  {
    "ResponseBodySet": {
      "responseId": "response_ata4rM8zB1",
      "bodyDescriptor": {
        "httpContentType": "application/json",
        "shapeId": "shape_UlLNexyAzZ",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.677Z"
      }
    }
  },
  {
    "RequestParameterAddedByPathAndMethod": {
      "parameterId": "request-parameter_GicuVFeYbm",
      "pathId": "path_osi3pD8diw",
      "httpMethod": "GET",
      "parameterLocation": "query",
      "name": "queryString",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.677Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_6TnsL6trq7",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.677Z"
      }
    }
  },
  {
    "RequestParameterShapeSet": {
      "parameterId": "request-parameter_GicuVFeYbm",
      "parameterDescriptor": {
        "shapeId": "shape_6TnsL6trq7",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.677Z"
      }
    }
  },
  {
    "RequestAdded": {
      "requestId": "request_AJISCmgnoU",
      "pathId": "path_osi3pD8diw",
      "httpMethod": "GET",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.677Z"
      }
    }
  },
  {
    "ResponseAddedByPathAndMethod": {
      "responseId": "response_HZFYN85Iui",
      "pathId": "path_osi3pD8diw",
      "httpMethod": "GET",
      "httpStatusCode": 200,
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.679Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_MiVhGwZrMY",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.680Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_iQB4J3IWzb",
      "baseShapeId": "$string",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.680Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_SXC48X1nmc",
      "shapeId": "shape_MiVhGwZrMY",
      "name": "name",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_SXC48X1nmc",
          "shapeId": "shape_iQB4J3IWzb"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.680Z"
      }
    }
  },
  {
    "ResponseBodySet": {
      "responseId": "response_HZFYN85Iui",
      "bodyDescriptor": {
        "httpContentType": "application/json",
        "shapeId": "shape_MiVhGwZrMY",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.681Z"
      }
    }
  },
  {
    "BatchCommitEnded": {
      "batchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "48bbf499-3d19-45be-a392-667939cce1d3",
        "clientCommandBatchId": "57630124-211a-440d-8bd3-2496ccc97f0c",
        "createdAt": "2021-02-01T18:25:15.681Z"
      }
    }
  },
  {
    "BatchCommitStarted": {
      "batchId": "2f5c2536-6500-495a-b0b1-947d55394009",
      "commitMessage": "initial spec",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.849Z"
      }
    }
  },
  {
    "PathComponentAdded": {
      "pathId": "path_rmPGKep5SW",
      "parentPathId": "root",
      "name": "posts",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.857Z"
      }
    }
  },
  {
    "PathComponentAdded": {
      "pathId": "path_CmA4ZrhSXc",
      "parentPathId": "root",
      "name": "profile",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.859Z"
      }
    }
  },
  {
    "RequestParameterAddedByPathAndMethod": {
      "parameterId": "request-parameter_VPFBtSXstf",
      "pathId": "path_rmPGKep5SW",
      "httpMethod": "GET",
      "parameterLocation": "query",
      "name": "queryString",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.859Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_PBYuBrTCLk",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.859Z"
      }
    }
  },
  {
    "RequestParameterShapeSet": {
      "parameterId": "request-parameter_VPFBtSXstf",
      "parameterDescriptor": {
        "shapeId": "shape_PBYuBrTCLk",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.859Z"
      }
    }
  },
  {
    "RequestAdded": {
      "requestId": "request_lUXaqigODI",
      "pathId": "path_rmPGKep5SW",
      "httpMethod": "GET",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.859Z"
      }
    }
  },
  {
    "ResponseAddedByPathAndMethod": {
      "responseId": "response_zEjgh3n6Uq",
      "pathId": "path_rmPGKep5SW",
      "httpMethod": "GET",
      "httpStatusCode": 200,
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.862Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_bGU4HicHkV",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.863Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_RvMMDY4eOD",
      "baseShapeId": "$string",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.863Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_jvGuxAjlRn",
      "shapeId": "shape_bGU4HicHkV",
      "name": "author",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_jvGuxAjlRn",
          "shapeId": "shape_RvMMDY4eOD"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.863Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_u6waaccsqU",
      "baseShapeId": "$number",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.864Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_gGefUJrPwF",
      "shapeId": "shape_bGU4HicHkV",
      "name": "id",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_gGefUJrPwF",
          "shapeId": "shape_u6waaccsqU"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.864Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_Mh5lZMGWAO",
      "baseShapeId": "$string",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.865Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_iYJ7dR4ihV",
      "shapeId": "shape_bGU4HicHkV",
      "name": "title",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_iYJ7dR4ihV",
          "shapeId": "shape_Mh5lZMGWAO"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.865Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_GsyFkrJzlL",
      "baseShapeId": "$list",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.865Z"
      }
    }
  },
  {
    "ShapeParameterShapeSet": {
      "shapeDescriptor": {
        "ProviderInShape": {
          "shapeId": "shape_GsyFkrJzlL",
          "providerDescriptor": {
            "ShapeProvider": {
              "shapeId": "shape_bGU4HicHkV"
            }
          },
          "consumingParameterId": "$listItem"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.865Z"
      }
    }
  },
  {
    "ResponseBodySet": {
      "responseId": "response_zEjgh3n6Uq",
      "bodyDescriptor": {
        "httpContentType": "application/json",
        "shapeId": "shape_GsyFkrJzlL",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.866Z"
      }
    }
  },
  {
    "RequestParameterAddedByPathAndMethod": {
      "parameterId": "request-parameter_nuUAdwMuqg",
      "pathId": "path_CmA4ZrhSXc",
      "httpMethod": "GET",
      "parameterLocation": "query",
      "name": "queryString",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.866Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_jfIeomMZ5p",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.866Z"
      }
    }
  },
  {
    "RequestParameterShapeSet": {
      "parameterId": "request-parameter_nuUAdwMuqg",
      "parameterDescriptor": {
        "shapeId": "shape_jfIeomMZ5p",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.866Z"
      }
    }
  },
  {
    "RequestAdded": {
      "requestId": "request_ncEWlZU2g3",
      "pathId": "path_CmA4ZrhSXc",
      "httpMethod": "GET",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.866Z"
      }
    }
  },
  {
    "ResponseAddedByPathAndMethod": {
      "responseId": "response_pan3yNmeiQ",
      "pathId": "path_CmA4ZrhSXc",
      "httpMethod": "GET",
      "httpStatusCode": 200,
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.867Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_ApnstcbWQx",
      "baseShapeId": "$object",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.867Z"
      }
    }
  },
  {
    "ShapeAdded": {
      "shapeId": "shape_sgKygyPuZL",
      "baseShapeId": "$string",
      "parameters": {
        "DynamicParameterList": {
          "shapeParameterIds": []
        }
      },
      "name": "",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.868Z"
      }
    }
  },
  {
    "FieldAdded": {
      "fieldId": "field_KhuvysQCWY",
      "shapeId": "shape_ApnstcbWQx",
      "name": "name",
      "shapeDescriptor": {
        "FieldShapeFromShape": {
          "fieldId": "field_KhuvysQCWY",
          "shapeId": "shape_sgKygyPuZL"
        }
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.869Z"
      }
    }
  },
  {
    "ResponseBodySet": {
      "responseId": "response_pan3yNmeiQ",
      "bodyDescriptor": {
        "httpContentType": "application/json",
        "shapeId": "shape_ApnstcbWQx",
        "isRemoved": false
      },
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.870Z"
      }
    }
  },
  {
    "BatchCommitEnded": {
      "batchId": "2f5c2536-6500-495a-b0b1-947d55394009",
      "eventContext": {
        "clientId": "anonymous",
        "clientSessionId": "e28408c3-7f74-4719-bc03-cbebc7b96c4a",
        "clientCommandBatchId": "2f5c2536-6500-495a-b0b1-947d55394009",
        "createdAt": "2021-02-01T18:26:25.870Z"
      }
    }
  }
]
const _endpointChanges = {
  opticUrl: 'https://example.com',
  endpoints: [
    {
      change: {
        category: 'added'
      },
      path: '/foo',
      method: 'get'
    },
    {
      change: {
        category: 'updated'
      },
      path: '/bar',
      method: 'post'
    }
  ]
}
async function main() {
  const spectacle = makeSpectacle(DiffEngine, {
    specEvents: _events
  })

  const batchCommitResults = await spectacle({
    query: `{
  batchCommits {
    createdAt
    batchId
  }
}`,
    variables: {}
  }) 

  console.log(JSON.stringify(batchCommitResults, null, 2))

  const endpointChangesResult = await spectacle({
    query: `{
  endpointChanges {
    opticUrl
    endpoints {
      change {
        category
      }
      path
      method
    }
  }
}`,
    variables: {}
  })

  console.log(JSON.stringify(endpointChangesResult, null, 2))

  const result = await spectacle({
    query: `{ 
    requests {
      id
      pathId
      absolutePathPattern
      method
      bodies {
        contentType
        rootShapeId
      }
      responses {
        id
        statusCode
        bodies {
          contentType
          rootShapeId
        }
      }
    }
}`,
    variables: {}
  })

  console.log(JSON.stringify(result, null, 2))

  {
    const result = await spectacle({
      query: `{ 
    shapeChoices(shapeId: "shape_RvMMDY4eOD") {
      id
      jsonType
    }
}`,
      variables: {}
    })
    console.log(JSON.stringify(result, null, 2))

  }
}

main()
/*
@TODO: add ids
@TODO: inline changelog since()
@TODO: add support for contributions
 */