'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChefHat, Loader2, Sparkles } from 'lucide-react';

import {
  SuggestWaffleCombinationOutput,
  suggestWaffleCombination,
} from '@/ai/flows/suggest-waffle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  userPreferences: z.string().min(3, 'Tell us a little more!'),
});

export function AISuggestion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestWaffleCombinationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPreferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const suggestion = await suggestWaffleCombination(values);
      setResult(suggestion);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get suggestion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ai-suggestion" className="scroll-mt-20">
      <Card className="w-full max-w-2xl mx-auto shadow-lg overflow-hidden">
        <CardHeader className="bg-secondary p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-headline">Can't Decide?</CardTitle>
              <CardDescription className="text-muted-foreground/90">Let our AI chef inspire you!</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are you craving?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., sweet & fruity, savory & spicy, something with chocolate..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Suggestion...
                  </>
                ) : (
                  'Suggest a Waffle'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {result && (
          <CardFooter className="p-6 pt-0">
            <Card className="w-full bg-secondary/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <ChefHat className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl font-headline">{result.suggestedCombination}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{result.reasoning}</p>
              </CardContent>
            </Card>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}
