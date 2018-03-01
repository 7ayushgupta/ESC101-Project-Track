#### Callbacks
In a nutshell, a callback can be informally described like this: function a calls function b, and wants to make b run a specific independent chunk of code at some point during b's execution. We want to be able to vary which chunk of code gets called in different calls to b, so it cannot be hard-coded inside b. So function a passes another function, c, to b, as one argument, and b uses that parameter c to call the functionality that a wants b to call. (Function b may pass some parameters to the function represented by c, when it calls it. These could be either internally generated, passed from a, or a combination of both). So, by changing the value of the function c that gets passed to b (on different calls to b), a can change what chunk of code b calls.

_C Example for a callback__

```
#include <stdio.h>
#include <stdlib.h>

/* The calling function takes a single callback as a parameter. */
void PrintTwoNumbers(int (*numberSource)(void)) {
    int val1= numberSource();
    int val2= numberSource();
    printf("%d and %d\n", val1, val2);
}

/* A possible callback */
int overNineThousand(void) {
    return (rand()%1000) + 9001;
}

/* Another possible callback. */
int meaningOfLife(void) {
    return 42;
}

/* Here we call PrintTwoNumbers() with three different callbacks. */
int main(void) {
    PrintTwoNumbers(&rand);
    PrintTwoNumbers(&overNineThousand);
    PrintTwoNumbers(&meaningOfLife);
    return 0;
}
```
