import React from 'react';
import {
  Box,
  Heading,
  FormControl,
  Input,
  FormLabel,
  FormHelperText,
  Flex,
  Spacer,
  Textarea,
  Button,
  Container,
  CloseButton,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';

const RULE_ITEM_DEFAULT_VALUE = {
  origin: '',
  decodeSelectors: '',
  loadedSelectors: '',
};

function OptionsForm({ rules }) {
  const toast = useToast();
  const {
    control,
    register,
    handleSubmit,
    formState
  } = useForm({
    defaultValues: {
      rules: rules
        ? rules : [RULE_ITEM_DEFAULT_VALUE]
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rules",
  });

  return (
    <Container maxW="container.xl">
      <Box p={4}>
        <Heading as="h1" size="lg">
          설정
        </Heading>
        <form
          noValidate
          onSubmit={handleSubmit((values) => {
            return new Promise((resolve) => {
              // eslint-disable-next-line no-undef
              if (typeof chrome.storage === 'undefined') {
                toast({
                  position: 'top',
                  status: 'success',
                  description: `DEBUG: ${JSON.stringify(values)}`,
                });

                resolve();
                return;
              }

              // eslint-disable-next-line no-undef
              chrome.storage.sync.set({ rules: values.rules }, function() {
                toast({
                  position: 'top',
                  status: 'success',
                  description: '저장이 완료되었습니다.',
                });
                resolve();
              });
            })
          })}
        >
        {fields.map((field, index) => {
          return (
            <Flex key={field.id} mt={4}>
              <Box>
                <Badge>{index + 1}</Badge>
              </Box>
              <Spacer />
              <Box w="30%">
                <FormControl
                  isRequired
                  isInvalid={Boolean(
                    formState.errors.rules &&
                    formState.errors.rules[index] &&
                    formState.errors.rules[index].origin
                  )}
                >
                  <FormLabel>URL</FormLabel>
                  <Input
                    placeholder="예) https://sentry.io"
                    {...register(`rules.${index}.origin`, { required: true })}
                  />
                  <FormHelperText>실행될 URL을 입력합니다.</FormHelperText>
                </FormControl>
              </Box>
              <Spacer />
              <Box w="30%">
                <FormControl
                  isRequired
                  isInvalid={Boolean(
                    formState.errors.rules &&
                    formState.errors.rules[index] &&
                    formState.errors.rules[index].decodeSelectors
                  )}
                  >
                  <FormLabel>Decode Selectors</FormLabel>
                  <Textarea
                    placeholder={'예) [data-test-id="loaded-device-name"], span.val-string'}
                    {...register(`rules.${index}.decodeSelectors`, { required: true })}
                  />
                  <FormHelperText>Decode할 Selector들을 입력합니다. (,로 구분)</FormHelperText>
                </FormControl>
              </Box>
              <Spacer />
              <Box w="30%">
                <FormControl>
                  <FormLabel>Loaded Selectors</FormLabel>
                  <Textarea
                    placeholder='예) [data-test-id="group"], span.loading'
                    {...register(`rules.${index}.loadedSelectors`)}
                  />
                  <FormHelperText>Load됨을 판단할 Selector들을 입력합니다. (,로 구분)</FormHelperText>
                </FormControl>
              </Box>
              <Spacer />
              <Flex align="center">
                <CloseButton onClick={() => {
                  if (fields.length === 1) {
                    toast({
                      position: 'top',
                      status: 'error',
                      description: '최소 1개의 옵션이 필요합니다.',
                    });

                    return;
                  }

                  remove(index);
                }} />
              </Flex>
            </Flex>
          )
        })}
          <Box py={6}>
            <Button
              isFullWidth
              type="button"
              onClick={() => {
                if (fields.length === 10) {
                  toast({
                    position: 'top',
                    status: 'error',
                    description: '최대 10개의 옵션 추가가 가능합니다.',
                  });
                  return;
                }

                append(RULE_ITEM_DEFAULT_VALUE)
              }}
            >
              +
            </Button>
          </Box>
          <Box textAlign="right">
            <Button type="submit" colorScheme="blue">저장</Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default OptionsForm;
