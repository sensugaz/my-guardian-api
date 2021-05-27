import { parse } from '@rsql/parser'
import {
  ExpressionNode,
  getSelector,
  getValue,
  isComparisonNode,
  isLogicNode,
} from '@rsql/ast'
import { Brackets, SelectQueryBuilder, WhereExpression } from 'typeorm'
import { HttpStatus } from '@nestjs/common'
import { OrderByEnum } from '../enums'
import { ApiException } from '../exceptions'
import { StringUtil } from './string.util'

const logicalAND: string[] = [';', 'and']
const logicalOR: string[] = [',', 'or']

export async function parserToTypeOrmQueryBuilder(
  tableName: string,
  query: string,
  repo: SelectQueryBuilder<any>,
  sort = 'created_date',
  orderBy: OrderByEnum = OrderByEnum.ASC,
): Promise<SelectQueryBuilder<any> | WhereExpression> {
  try {
    sort = tableName + '.' + StringUtil.snakeToCamel(sort)

    if (query) {
      const queryParse = parse(query)
      const repository: any = await parseExpressionToQueryBuilder(
        repo,
        queryParse,
        '',
      )
      return repository.orderBy(sort, orderBy)
    } else {
      return repo.orderBy(sort, orderBy)
    }
  } catch (error) {
    throw new ApiException({
      module: 'system',
      type: 'application',
      codes: ['query_syntax_not_supported'],
      statusCode: HttpStatus.BAD_REQUEST,
    })
  }
}

async function parseExpressionToQueryBuilder(
  repo: SelectQueryBuilder<any> | WhereExpression,
  expression: ExpressionNode,
  logical: string,
): Promise<SelectQueryBuilder<any> | WhereExpression> {
  if (isComparisonNode(expression)) {
    return comparison2queryBuilder(repo, expression, logical)
  }

  if (isLogicNode(expression)) {
    const { operator, left, right } = expression

    repo.andWhere(
      new Brackets(async (qb) => {
        await parseExpressionToQueryBuilder(qb, left, operator)
      }),
    )

    if (isAndLogical(operator)) {
      return repo.andWhere(
        new Brackets(async (qb) => {
          await parseExpressionToQueryBuilder(qb, right, operator)
        }),
      )
    } else if (isORLogical(operator)) {
      return repo.orWhere(
        new Brackets(async (qb) => {
          await parseExpressionToQueryBuilder(qb, right, operator)
        }),
      )
    } else {
      throw new ApiException({
        module: 'system',
        type: 'application',
        codes: ['query_syntax_not_supported'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }
  }

  return repo
}

function comparison2queryBuilder(
  model: SelectQueryBuilder<any> | WhereExpression,
  expression: ExpressionNode,
  logical: string,
): SelectQueryBuilder<any> | WhereExpression {
  if (isComparisonNode(expression)) {
    const { operator } = expression
    const selector = getSelector(expression)
    const value = getValue(expression)
    let val =
      operator == '=in=' || operator == '=out='
        ? `(:...${selector})`
        : `:${selector}`
    const likeString = operator == '=like=' || operator == '=ilike=' ? `%` : ''
    const param = {}

    if (likeString !== '') {
      param[selector] = likeString + value + likeString
    } else {
      param[selector] = value
    }

    if (operator == '=isnull=') {
      val = ''
    }

    const stringQuery = `${StringUtil.camelToSnake(selector)} ${operatorMapping(
      operator,
    )} ${val}`

    if (isORLogical(logical)) {
      model = model.orWhere(stringQuery, param)
    } else if (isAndLogical(logical)) {
      model = model.andWhere(stringQuery, param)
    } else {
      model = model.where(stringQuery, param)
    }
  }

  return model
}

function operatorMapping(operator: string): string {
  const op = {
    '==': '=',
    '!=': 'is distinct from',
    '=in=': 'IN',
    '=out=': 'NOT IN',
    '=lt=': '<',
    '=gt=': '>',
    '=ge=': '>=',
    '=like=': 'LIKE',
    '=ilike=': 'ILIKE',
    '=isnull=': 'IS NULL',
  }

  return op[operator] ? op[operator] : operator
}

function isAndLogical(value: string): boolean {
  return logicalAND.includes(value)
}

function isORLogical(value: string): boolean {
  return logicalOR.includes(value)
}
