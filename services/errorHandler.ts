import * as Sentry from '@sentry/react-native';
export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly statusCode: number;
  public readonly message: string;

  constructor(
    message: string,
    isOperational: boolean = true,
    statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name; 
    this.isOperational = isOperational;
    this.statusCode = statusCode;
    this.message = message;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ApiError extends AppError {
  constructor(
    message: string = "Ocorreu um erro na comunicação com o servidor.", 
    statusCode: number 
  ) {
    super(message, true, statusCode);
    this.name = "ApiError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado.") {
    super(message, true, 404);
    this.name = "NotFoundError";
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string = "Ocorreu um erro na lógica da aplicação.") {
    super(message, true, 400); 
  }
}

export class ImageProcessingError extends AppError {
    constructor(message: string = "Não foi possível processar a imagem.") {
        super(message, true, 422);
    }
}

export const handleError = (
  error: unknown,
  context: string = 'unknown',
  extraData: Record<string, any> = {}
): void => {
  let errorToLog: Error;
  let isOperational = true;

  if (error instanceof AppError) {
    errorToLog = error;
    isOperational = error.isOperational;
  } else if (error instanceof Error) {
    errorToLog = error;
  } else {
    errorToLog = new Error(String(error));
    errorToLog.name = 'UnknownThrownError';
  }

  console.error(`[ERRO NO CONTEXTO: ${context}]`, errorToLog);

  Sentry.captureException(errorToLog, (scope) => {
    scope.setTag('context', context);
    
    scope.setLevel(isOperational ? 'warning' : 'error');

    if (Object.keys(extraData).length > 0) {
      scope.setExtras(extraData);
    }
    
    return scope;
  });
};