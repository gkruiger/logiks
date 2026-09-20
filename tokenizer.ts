import { type Token, Tokens } from './types.ts'

export class Tokenizer {

  constructor() {
    //
  }

  tokenize(input: string): Token[] {

    function splitTokens(tokensToUseForSplitting: Token[], exactMatch: boolean) {
      for(const tokenToUseForSplitting of tokensToUseForSplitting) {       
        tokens = tokens.flatMap(token => {
          const delimiter = tokenToUseForSplitting.value

          let splitValues = []
          if(delimiter == '') {
            splitValues.push(token.value)
          } else {
            const safeDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            let regex
            if (exactMatch) {
              regex = new RegExp(`(?=(?<=^)${safeDelimiter}(?=$))|(?<=(?<=^)${safeDelimiter}(?=$))`);
            } else {
              regex = new RegExp(`(?=(?:${safeDelimiter}))|(?<=(?:${safeDelimiter}))`);
            }
            
            splitValues = token.value
              .split(regex)
              .filter(Boolean)
          }

          const mappedSplitValues = splitValues.map(splitValue => {
            if(splitValue === delimiter) {
              return tokenToUseForSplitting
            } else {
              return {...token, value: splitValue}
            }
          })

          return mappedSplitValues
        })
      }
    }

    const defaultToken = Tokens.find(token => token.default)!

    let tokens: Token[] = [{
      ...defaultToken, 
      value: input
    }]

    const tokensToIgnore = Tokens.filter(token => token.ignore)
    splitTokens(tokensToIgnore, false)
    tokens = tokens.filter(token => !token.ignore)

    const tokensNotToIgnoreThatCantBePartOfAString = Tokens.filter(token => !token.ignore && !token.canBePartOfString)
    splitTokens(tokensNotToIgnoreThatCantBePartOfAString, false)

    const tokensNotToIgnoreThatCanBePartOfAString = Tokens.filter(token => !token.ignore && token.canBePartOfString)
    splitTokens(tokensNotToIgnoreThatCanBePartOfAString, true)

    return tokens
  }

}